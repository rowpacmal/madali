import useTeacherManagement from '../../hooks/useTeacherManagement';

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
};

function Admin() {
  const {
    getAllCoursesByTeacher,
    getCourse,
    getTotalCoursesByTeacher,

    deleteCourses,
    registerCourses,

    getAllTeachers,
    getTeacher,
    getTotalTeachers,

    deleteTeachers,
    registerTeachers,
    updateTeacher,
  } = useTeacherManagement();

  return (
    <>
      <h2>Admin</h2>

      <hr />

      <h3>Courses</h3>

      <div style={style}>
        <button
          onClick={async () =>
            getAllCoursesByTeacher((await getAllTeachers())[0])
          }
        >
          Get All Courses
        </button>

        <button
          onClick={async () =>
            getCourse(
              (await getAllCoursesByTeacher((await getAllTeachers())[0]))[0]
            )
          }
        >
          Get Course
        </button>

        <button
          onClick={async () =>
            getTotalCoursesByTeacher((await getAllTeachers())[0])
          }
        >
          Get Total Number of Courses
        </button>
      </div>

      <div style={style}>
        <button
          onClick={async () =>
            registerCourses((await getAllTeachers())[0], [240103], [2401], [10])
          }
        >
          Add Courses
        </button>

        <button
          onClick={async () =>
            deleteCourses((await getAllTeachers())[0], [240103])
          }
        >
          Delete Courses
        </button>
      </div>

      <hr />

      <h3>Teachers</h3>

      <div style={style}>
        <button onClick={getAllTeachers}>Get All Teachers</button>

        <button onClick={async () => getTeacher((await getAllTeachers())[0])}>
          Get Teacher
        </button>

        <button onClick={getTotalTeachers}>Get Total Number of Teachers</button>
      </div>

      <div style={style}>
        <button
          onClick={() =>
            registerTeachers(
              ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
              [2401]
            )
          }
        >
          Add Teachers
        </button>

        <button
          onClick={() =>
            deleteTeachers(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'])
          }
        >
          Delete Teachers
        </button>

        <button
          onClick={() =>
            updateTeacher('0x70997970c51812dc3a010c7d01b50e0d17dc79c8', 2403)
          }
        >
          Update Teacher
        </button>
      </div>
    </>
  );
}

export default Admin;
