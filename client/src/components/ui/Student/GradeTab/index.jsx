import { useContext, useEffect, useState } from 'react';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import useCourseService from '../../../../services/useCourseService';
import Management from '../../Management';
import library from './library';
import { AppContext } from '../../../../contexts/AppContext';
import style from './style.module.css';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import GradeModal from '../GradeModal';
import useTeacherService from '../../../../services/useTeacherService';

function GradeTab() {
  const { account } = useContext(AppContext);
  const { studentContract, getStudent } = useStudentManagement();
  const { teacherContract, getAllCoursesByTeacher, getAllTeachers, getCourse } =
    useTeacherManagement();
  const { getCourse: getCourseInfo } = useCourseService();
  const { getTeacher } = useTeacherService();
  const [courses, setCourses] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!teacherContract || !studentContract) return;

    handleOnRefresh();
  }, [teacherContract, studentContract]);

  async function handleOnRefresh() {
    const coursesTemp = [];
    const studentData = await getStudent(account);
    const teachersData = await getAllTeachers();

    for (let teacher of teachersData) {
      const coursesData = await getAllCoursesByTeacher(teacher);

      for (let course of coursesData) {
        const courseData = await getCourse(course);

        if (!courseData.exists) continue;

        if (courseData.class === studentData.class) {
          const data = await getCourseInfo(courseData.id);
          const teacherData = await getTeacher(courseData.teacher);

          data.teacherName = `${teacherData.firstName} ${teacherData.lastName}`;

          coursesTemp.push(data);
        }
      }
    }

    setCourses(coursesTemp);
  }

  function handleOnView(item) {
    setModalData(item);
    setShowModal(true);
  }

  return (
    <>
      <section>
        <header className={style.header}>
          <h2>Grades Overview</h2>
        </header>

        <Management
          list={courses}
          library={library}
          handleOnRefresh={handleOnRefresh}
          handleOnView={handleOnView}
        />
      </section>

      {showModal && <GradeModal data={modalData} setShowModal={setShowModal} />}
    </>
  );
}

export default GradeTab;
