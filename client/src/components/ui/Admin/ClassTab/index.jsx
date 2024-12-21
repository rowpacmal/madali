import { useEffect, useState } from 'react';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import useClassService from '../../../../services/useClassService';
import Class from '../../../../model/Class';
import Management from '../../Management';
import library from './library';

function ClassTab() {
  const { studentContract, getAllClasses, registerClass, deleteClasses } =
    useStudentManagement();
  const { getClass, addClass, deleteClass } = useClassService();
  const [classes, setClasses] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (!studentContract) return;

    handleOnRefresh();
  }, [studentContract]);

  async function handleOnSubmit() {
    const classIDs = formInputs.map((item) => Number(item.code));

    try {
      await registerClass(classIDs);

      for (let item of formInputs) {
        await addClass(
          new Class({
            id: item.code,
            name: item.name,
            year: item.year,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnRefresh() {
    const tempClasses = [];
    const tempSelections = {};
    const classIDs = await getAllClasses();

    for (let classID of classIDs) {
      const classData = await getClass(classID);

      tempClasses.push(classData);

      tempSelections[classID] = false;
    }

    console.log(tempClasses);
    console.log(tempSelections);

    setClasses(tempClasses);
    setSelections(tempSelections);
  }

  async function handleOnDelete() {
    console.log(selections);

    const classIDs = Object.keys(selections).filter((key) => selections[key]);

    console.log(classIDs);

    try {
      await deleteClasses(classIDs);

      for (let classID of classIDs) {
        await deleteClass(classID);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <header>
        <h2>Classes</h2>
      </header>

      <Management
        list={classes}
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

export default ClassTab;
