import useTeacherManagement from '../../hooks/useTeacherManagement';

function Admin() {
  const { getAllTeachers } = useTeacherManagement();

  return (
    <>
      <h2>Admin</h2>

      <button onClick={getAllTeachers}>Get All Teachers</button>
    </>
  );
}

export default Admin;
