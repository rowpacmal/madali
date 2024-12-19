import Teacher from '../../model/Teacher';
import useTeacherService from '../../services/useTeacherService';

function Home() {
  const { getTeachers, addTeacher, updateTeacher } = useTeacherService();

  return (
    <>
      <h2>Home</h2>

      <button onClick={getTeachers}>Get Teachers</button>

      <button
        onClick={() =>
          addTeacher(
            new Teacher({
              id: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
              firstName: 'John',
              lastName: 'Doe',
              email: 'V5bK5@example.com',
              address: '123 Main St',
              phoneNumber: '555-555-5555',
            })
          )
        }
      >
        Add Teacher
      </button>

      <button
        onClick={() =>
          updateTeacher('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', {
            firstName: 'Jenny',
            lastName: 'Olson',
          })
        }
      >
        Update Teacher
      </button>
    </>
  );
}

export default Home;
