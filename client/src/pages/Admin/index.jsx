import useTeacherManagement from '../../hooks/useTeacherManagement';

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
};

function Admin() {
  const {
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

      <div style={style}>
        <button onClick={getAllTeachers}>Get All Teachers</button>

        <button onClick={async () => getTeacher((await getAllTeachers())[0])}>
          Get Teacher
        </button>

        <button onClick={getTotalTeachers}>Get Total Number of Teachers</button>
      </div>

      <hr />

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
