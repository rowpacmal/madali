import { useEffect, useState } from 'react';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import useStudentService from '../../../../services/useStudentService';
import Management from '../../Management';
import library from './library';
import Student from '../../../../model/Student';
import style from './style.module.css';

// This is the student tab, which is used to manage students, create new students, and delete students.
function StudentTab() {
  const {
    studentContract,
    getAllClasses,
    getAllStudents,
    registerStudents,
    deleteStudents,
  } = useStudentManagement();
  const { getStudent, addStudent, deleteStudent } = useStudentService();
  const [students, setStudents] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});
  const [classes, setClasses] = useState([]);
  const [classID, setClassID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!studentContract) return;

    handleOnRefresh();
  }, [studentContract]);

  // This is the function that is called when the user clicks the submit button.
  async function handleOnSubmit() {
    if (!classID) {
      console.error('No class ID provided.');
      return;
    }

    const studentAddresses = formInputs.map((item) => item.walletAddress);

    console.log(classID);
    console.log(studentAddresses);

    try {
      await registerStudents(Number(classID), studentAddresses);

      for (let item of formInputs) {
        await addStudent(
          new Student({
            id: item.walletAddress,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            address: item.address,
            phoneNumber: item.phoneNumber,
            classID,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // This is the function that is called when the user clicks the refresh button, or the page is reloaded.
  async function handleOnRefresh(classIDValue = null) {
    setIsLoading(true);

    const tempStudents = [];
    const tempSelections = {};
    const classesData = await getAllClasses();
    const classIDData = classIDValue
      ? classIDValue
      : classID
      ? classID
      : classesData[0];
    let studentAddresses = [];

    if (classIDData) {
      studentAddresses = await getAllStudents(Number(classIDData));
    }

    for (let address of studentAddresses) {
      const data = await getStudent(address);

      tempStudents.push(data);

      tempSelections[address] = false;
    }

    console.log(tempStudents);
    console.log(tempSelections);

    setStudents(tempStudents);
    setSelections(tempSelections);

    setClasses(classesData);
    setClassID(classIDData);

    setIsLoading(false);
  }

  // This is the function that is called when the user clicks the delete button.
  async function handleOnDelete() {
    console.log(selections);

    const studentAddresses = Object.keys(selections).filter(
      (key) => selections[key]
    );

    console.log(studentAddresses);

    try {
      await deleteStudents(classID, studentAddresses);

      for (let address of studentAddresses) {
        await deleteStudent(address);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <header className={style.header}>
        <h2>Student Management</h2>
      </header>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={style.dropdown}>
            <div className={style.selector}>
              <label>Class Code</label>

              <select
                value={classID}
                onChange={(e) => {
                  setClassID(e.target.value);
                  handleOnRefresh(e.target.value);
                }}
              >
                {classes.length > 0 ? (
                  <>
                    {classes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </>
                ) : (
                  <option disabled selected>
                    No classes found
                  </option>
                )}
              </select>
            </div>
          </div>

          <Management
            list={students}
            library={library}
            formInputs={formInputs}
            setFormInputs={setFormInputs}
            selections={selections}
            setSelections={setSelections}
            handleOnSubmit={handleOnSubmit}
            handleOnRefresh={handleOnRefresh}
            handleOnDelete={handleOnDelete}
          />
        </>
      )}
    </section>
  );
}

export default StudentTab;
