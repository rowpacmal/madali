import useStudentManagement from '../../hooks/useStudentManagement';
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
  const {
    getAllClasses,
    getTotalClasses,

    addClass,
    deleteClasses,

    getAllStudents,
    getStudent,
    getTotalStudents,

    deleteStudents,
    registerStudents,
    updateStudent,
  } = useStudentManagement();

  return (
    <>
      <h2>Admin</h2>

      {/* Classes */}
      <div style={style}>
        <h3>Classes</h3>

        <div style={style}>
          <button onClick={getAllClasses}>Get All Classes</button>

          <button onClick={getTotalClasses}>Get Total Number of Classes</button>
        </div>

        <div style={style}>
          <button onClick={() => addClass([2401, 2403])}>Add Classes</button>

          <button onClick={() => deleteClasses([2401, 2403])}>
            Delete Classes
          </button>
        </div>
      </div>

      <hr />

      {/* Students */}
      <div style={style}>
        <h3>Students</h3>

        <div style={style}>
          <button
            onClick={async () => {
              getAllStudents((await getAllClasses())[0]);
              getAllStudents((await getAllClasses())[1]);
            }}
          >
            Get All Students
          </button>

          <button
            onClick={async () => {
              getStudent((await getAllStudents((await getAllClasses())[0]))[0]);
              getStudent((await getAllStudents((await getAllClasses())[1]))[0]);
            }}
          >
            Get Student
          </button>

          <button
            onClick={async () => {
              getTotalStudents((await getAllClasses())[0]);
              getTotalStudents((await getAllClasses())[1]);
            }}
          >
            Get Total Number of Students
          </button>
        </div>

        <div style={style}>
          <button
            onClick={async () =>
              registerStudents((await getAllClasses())[0], [
                '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
              ])
            }
          >
            Add Students
          </button>

          <button
            onClick={async () => {
              deleteStudents((await getAllClasses())[0], [
                '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
              ]);
              deleteStudents((await getAllClasses())[1], [
                '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
              ]);
            }}
          >
            Delete Students
          </button>

          <button
            onClick={async () =>
              updateStudent(
                '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                2401,
                2403
              )
            }
          >
            Update Student
          </button>
        </div>
      </div>

      <hr />

      {/* Courses */}
      <div style={style}>
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
              registerCourses(
                (await getAllTeachers())[0],
                [240103],
                [2401],
                [10]
              )
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
      </div>

      <hr />

      {/* Teachers */}
      <div style={style}>
        <h3>Teachers</h3>

        <div style={style}>
          <button onClick={getAllTeachers}>Get All Teachers</button>

          <button onClick={async () => getTeacher((await getAllTeachers())[0])}>
            Get Teacher
          </button>

          <button onClick={getTotalTeachers}>
            Get Total Number of Teachers
          </button>
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
      </div>
    </>
  );
}

export default Admin;
