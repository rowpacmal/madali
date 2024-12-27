import { useContext, useEffect, useState } from 'react';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import useCourseService from '../../../../services/useCourseService';
import Management from '../../Management';
import library from './library';
import { AppContext } from '../../../../contexts/AppContext';
import style from './style.module.css';
import Course from '../../../../model/Course';

// This component is the teacher's course tab, for creating and managing courses.
function CourseTab() {
  const { account } = useContext(AppContext);
  const {
    teacherContract,
    getAllCoursesByTeacher,
    registerCourses,
    deleteCourses,
  } = useTeacherManagement();
  const { getCourse, addCourse, deleteCourse } = useCourseService();
  const [courses, setCourses] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (!teacherContract) return;

    handleOnRefresh();
  }, [teacherContract]);

  // This function is called when the form is submitted.
  async function handleOnSubmit() {
    const teacherCourses = formInputs.map((item) => item.code);
    const courseClasses = formInputs.map((item) => Number(item.courseClass));
    const courseModules = formInputs.map((item) => Number(item.modules));

    console.log(teacherCourses);
    console.log(courseClasses);
    console.log(courseModules);

    try {
      await registerCourses(
        account,
        teacherCourses,
        courseClasses,
        courseModules
      );

      for (let item of formInputs) {
        await addCourse(
          new Course({
            id: item.code,
            name: item.name,
            teacher: account,
            courseClass: item.courseClass,
            modules: item.modules,
            startDate: item.startDate,
            endDate: item.endDate,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // This function is called when the refresh button is clicked, or the page is reloaded.
  async function handleOnRefresh() {
    const tempCourses = [];
    const tempSelections = {};
    const courseIDs = await getAllCoursesByTeacher(account);

    for (let course of courseIDs) {
      const data = await getCourse(course);

      tempCourses.push(data);

      tempSelections[course] = false;
    }

    console.log(tempCourses);
    console.log(tempSelections);

    setCourses(tempCourses);
    setSelections(tempSelections);
  }

  // This function is called when the delete button is clicked.
  async function handleOnDelete() {
    console.log(selections);

    const courseIDs = Object.keys(selections).filter((key) => selections[key]);

    console.log(courseIDs);

    try {
      await deleteCourses(account, courseIDs);

      for (let course of courseIDs) {
        await deleteCourse(course);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <header className={style.header}>
        <h2>Course Management</h2>
      </header>

      <Management
        list={courses}
        library={library}
        formInputs={formInputs}
        setFormInputs={setFormInputs}
        selections={selections}
        setSelections={setSelections}
        handleOnSubmit={handleOnSubmit}
        handleOnRefresh={handleOnRefresh}
        handleOnDelete={handleOnDelete}
      />
    </section>
  );
}

export default CourseTab;
