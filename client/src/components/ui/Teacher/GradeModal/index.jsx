import { useEffect, useState } from 'react';
import useGradingSystem from '../../../../hooks/useGradingSystem';
import Input from '../../../Input';
import Form from '../../../Form';
import Modal from '../../../Modal';
import style from './style.module.css';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import { Log } from 'ethers';
import GradeItem from '../GradeItem';
import ProgressBar from '../../../ProgressBar';

function GradeModal({ data, course, setShowModal }) {
  const { gradingContract, getAllGradesByStudent, getGrade, addGrades } =
    useGradingSystem();
  const { getCourse } = useTeacherManagement();
  const [grades, setGrades] = useState([]);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeModule, setGradeModule] = useState('');
  const [gradeProgress, setGradeProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!gradingContract) return;

    handleOnRefresh();
  }, [gradingContract]);

  useEffect(() => {
    if (displayProgress < gradeProgress) {
      const timeout = setTimeout(() => {
        setDisplayProgress((prev) => Math.min(prev + 1, gradeProgress));
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [displayProgress, gradeProgress]);

  async function handleOnSubmit() {
    let gradeToAdd = 0;

    switch (gradeScore.toLocaleUpperCase()) {
      case 'A':
        gradeToAdd = 6;
        break;

      case 'B':
        gradeToAdd = 5;
        break;

      case 'C':
        gradeToAdd = 4;
        break;

      case 'D':
        gradeToAdd = 3;
        break;

      case 'E':
        gradeToAdd = 2;
        break;

      case 'F':
        gradeToAdd = 1;
        break;

      default:
        gradeToAdd = 0;
        break;
    }

    if (!gradeToAdd) {
      console.error('Invalid grade');
      return;
    }

    try {
      await addGrades(course, gradeModule, [data.id], [gradeToAdd], {
        from: data.walletAddress,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnRefresh() {
    const gradesData = [];
    const gradeIDs = await getAllGradesByStudent(data.id);

    for (let grade of gradeIDs) {
      const data = await getGrade(grade);

      if (data.course === course) {
        gradesData.push(data);
      }
    }

    const courseMaxModules = await getCourse(course);
    const maxModulesTemp = Array.from(
      { length: courseMaxModules.modules },
      (_, i) => {
        for (let grade of gradesData) {
          if (grade.module === i + 1) {
            return {
              id: grade.id,
              module: grade.module,
              grade: grade.grade,
            };
          }
        }

        return {
          id: null,
          module: i + 1,
          grade: null,
        };
      }
    );

    const currentProgress =
      (gradesData.length / courseMaxModules.modules) * 100;
    setGradeProgress(currentProgress);
    setDisplayProgress(0);

    console.log(maxModulesTemp);

    setGrades(maxModulesTemp);
  }

  return (
    <Modal
      title={`${data.firstName} ${data.lastName}`}
      setShowModal={setShowModal}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
      >
        <div className={style.inputs}>
          <Input
            placeholder="Enter grade..."
            label="Grade"
            value={gradeScore}
            onChange={(e) => setGradeScore(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Enter module..."
            label="Module"
            value={gradeModule}
            onChange={(e) => setGradeModule(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Add Grade</button>
        </div>
      </Form>

      <div className={style.progressContainer}>
        <span>Student Progress: {displayProgress}%</span>

        <ProgressBar progress={gradeProgress} />
      </div>

      <ul className={style.ul}>
        <li className={style.liHeader}>
          <div className={style.module}>
            <span>Module</span>

            <span>Grade</span>
          </div>

          <div className={style.buttons}>
            <button type="button" onClick={handleOnRefresh}>
              Refresh
            </button>
          </div>
        </li>

        {grades.map((grade, index) => (
          <GradeItem grade={grade} key={index} style={style} />
        ))}
      </ul>
    </Modal>
  );
}

export default GradeModal;
