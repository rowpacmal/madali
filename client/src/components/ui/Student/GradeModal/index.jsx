import { useContext, useEffect, useState } from 'react';
import useGradingSystem from '../../../../hooks/useGradingSystem';
import Modal from '../../../Modal';
import style from './style.module.css';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import GradeItem from '../GradeItem';
import ProgressBar from '../../../ProgressBar';
import { AppContext } from '../../../../contexts/AppContext';

function GradeModal({ data, setShowModal }) {
  const { account } = useContext(AppContext);
  const { gradingContract, getAllGradesByStudent, getGrade } =
    useGradingSystem();
  const { getCourse } = useTeacherManagement();
  const [grades, setGrades] = useState([]);
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

  async function handleOnRefresh() {
    const courseID = Number(data.id);
    const gradesData = [];
    const gradeIDs = await getAllGradesByStudent(account);

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
      title={`${data.name}`}
      subTitle={`${data.id}`}
      setShowModal={setShowModal}
    >
      <div className={style.progressContainer}>
        <span>Your Progress: {displayProgress}%</span>

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
            <GradeItem grade={grade} key={index} style={style} />
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export default GradeModal;
