import Person from '../../model/Person';
import Student from '../../model/Student';
import Teacher from '../../model/Teacher';
import useStudentService from '../../services/useStudentService';
import useTeacherService from '../../services/useTeacherService';

function Home() {
  const { getTeachers, addTeacher, updateTeacher } = useTeacherService();
  const { getStudents, addStudent } = useStudentService();

  return (
    <>
      <h2>Home</h2>

      <div>
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
      </div>

      <br />

      <div>
        <button onClick={getStudents}>Get Students</button>

        <button
          onClick={() =>
            addStudent(
              new Student({
                id: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                firstName: 'Billy',
                lastName: 'Bob',
                address: '123 Main St',
                guardians: [
                  new Person({
                    firstName: 'Sarah',
                    lastName: 'Bob',
                    email: 'V5bK5@example.com',
                    address: '123 Main St',
                    phoneNumber: '555-555-5555',
                  }),
                  new Person({
                    firstName: 'Robert',
                    lastName: 'Bob',
                    email: 'V5bK5@example.com',
                    address: '123 Main St',
                    phoneNumber: '555-555-5555',
                  }),
                ],
              })
            )
          }
        >
          Add Student
        </button>
      </div>
    </>
  );
}

export default Home;
