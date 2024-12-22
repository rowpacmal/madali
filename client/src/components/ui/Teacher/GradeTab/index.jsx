import { useContext, useEffect, useState } from 'react';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import useCourseService from '../../../../services/useCourseService';
import Management from '../../Management';
import library from './library';
import { AppContext } from '../../../../contexts/AppContext';
import style from './style.module.css';
import useStudentService from '../../../../services/useStudentService';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import GradeModal from '../GradeModal';

function GradeTab() {
  const { account } = useContext(AppContext);
  const { studentContract, getAllStudents } = useStudentManagement();
  const { getStudent } = useStudentService();
  const { teacherContract, getAllCoursesByTeacher } = useTeacherManagement();
  const { getCourse } = useCourseService();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!teacherContract || !studentContract) return;

    handleOnRefresh();
  }, [teacherContract, studentContract]);

  async function handleOnRefresh(courseIDValue = null) {
    setCourses(await getAllCoursesByTeacher(account));

    const tempStudents = [];
    const coursesData = await getAllCoursesByTeacher(account);
    const courseIDData = courseIDValue ? courseIDValue : coursesData[0];
    let teacherCourse = {};

    if (courseIDData) {
      teacherCourse = await getCourse(courseIDData);
    }

    let studentAddresses = [];

    if (teacherCourse.courseClass) {
      studentAddresses = await getAllStudents(
        Number(teacherCourse.courseClass)
      );
    }

    for (let address of studentAddresses) {
      const data = await getStudent(address);

      tempStudents.push(data);
    }

    console.log(tempStudents);

    setStudents(tempStudents);
    setCourses(coursesData);
    setCourseID(courseIDData);
  }

  function handleOnView(item) {
    setModalData(item);
    setShowModal(true);
  }

  return (
    <>
      <section>
        <header className={style.header}>
          <h2>Grade Management</h2>
        </header>

        <div className={style.dropdown}>
          <div className={style.selector}>
            <label>Course Code</label>

            <select
              value={courseID}
              onChange={(e) => {
                setCourseID(e.target.value);
                handleOnRefresh(e.target.value);
              }}
            >
              {courses.length > 0 ? (
                <>
                  {courses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled selected>
                  No courses found
                </option>
              )}
            </select>
          </div>
        </div>

        <Management
          list={students}
          library={library}
          handleOnRefresh={handleOnRefresh}
          handleOnView={handleOnView}
        />
      </section>

      {showModal && (
        <GradeModal
          data={modalData}
          course={courseID}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}

export default GradeTab;
