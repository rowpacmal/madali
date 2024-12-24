import { useEffect, useState } from 'react';
import useGradingSystem from '../../../../hooks/useGradingSystem';
import Input from '../../../Input';
import Form from '../../../Form';
import Modal from '../../../Modal';
import style from './style.module.css';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import GradeItem from '../GradeItem';
import ProgressBar from '../../../ProgressBar';

function GradeModal({ data, course, courseName, setShowModal }) {
  const { gradingContract, getAllGradesByStudent, getGrade, addGrades } =
    useGradingSystem();
  const { getCourse } = useTeacherManagement();
  const [grades, setGrades] = useState([]);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeModule, setGradeModule] = useState('');
  const [gradeProgress, setGradeProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(
    () => {
      if (!gradingContract) return;

      handleOnRefresh();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gradingContract]
  );

  useEffect(() => {
    if (displayProgress < gradeProgress) {
      const timeout = setTimeout(() => {
        setDisplayProgress((prev) => Math.min(prev + 1, gradeProgress));
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [displayProgress, gradeProgress]);

  async function handleOnSubmit() {
    const courseID = Number(course);
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
      await addGrades(courseID, gradeModule, [data.id], [gradeToAdd], {
        from: data.walletAddress,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnRefresh() {
    const courseID = Number(course);
    const gradesData = [];
    const gradeIDs = await getAllGradesByStudent(data.id);

    for (let grade of gradeIDs) {
      const data = await getGrade(grade);

      if (data.course === courseID) {
        gradesData.push(data);
      }
    }

    const courseMaxModules = await getCourse(courseID);
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
      subTitle={`${courseName} (${course})`}
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

      <div className={style.ulContainer}>
        <ul className={style.ul}>
          <li className={style.liHeader}>
            <div className={style.module}>
              <span>Minted</span>

              <span>Grade ID</span>

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
            <GradeItem
              student={data.id}
              course={course}
              grade={grade}
              key={index}
              style={style}
            />
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export default GradeModal;
