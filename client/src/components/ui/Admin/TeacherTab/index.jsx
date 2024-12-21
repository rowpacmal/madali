import { useEffect, useState } from 'react';
import useTeacherManagement from '../../../../hooks/useTeacherManagement';
import useTeacherService from '../../../../services/useTeacherService';
import Management from '../../Management';
import library from './library';
import Teacher from '../../../../model/Teacher';

function TeacherTab() {
  const { teacherContract, getAllTeachers, registerTeachers, deleteTeachers } =
    useTeacherManagement();
  const { getTeacher, addTeacher, deleteTeacher } = useTeacherService();
  const [teachers, setTeachers] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (!teacherContract) return;

    handleOnRefresh();
  }, [teacherContract]);

  async function handleOnSubmit() {
    const teacherAddresses = formInputs.map((item) => item.walletAddress);
    const teacherClasses = formInputs.map((item) => item.classID);

    console.log(teacherAddresses);
    console.log(teacherClasses);

    try {
      await registerTeachers(teacherAddresses, teacherClasses);

      for (let item of formInputs) {
        await addTeacher(
          new Teacher({
            id: item.walletAddress,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            address: item.address,
            phoneNumber: item.phoneNumber,
            classID: item.classID,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnRefresh() {
    const tempTeachers = [];
    const tempSelections = {};
    const teacherAddresses = await getAllTeachers();

    for (let address of teacherAddresses) {
      const data = await getTeacher(address);

      tempTeachers.push(data);

      tempSelections[address] = false;
    }

    console.log(tempTeachers);
    console.log(tempSelections);

    setTeachers(tempTeachers);
    setSelections(tempSelections);
  }

  async function handleOnDelete() {
    console.log(selections);

    const teacherAddresses = Object.keys(selections).filter(
      (key) => selections[key]
    );

    console.log(teacherAddresses);

    try {
      await deleteTeachers(teacherAddresses);

      for (let address of teacherAddresses) {
        await deleteTeacher(address);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <header>
        <h2>Teacher</h2>
      </header>

      <Management
        list={teachers}
        library={library}
        isManager
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

export default TeacherTab;
