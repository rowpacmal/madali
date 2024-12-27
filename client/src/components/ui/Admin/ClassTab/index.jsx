import { useEffect, useState } from 'react';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import useClassService from '../../../../services/useClassService';
import Class from '../../../../model/Class';
import Management from '../../Management';
import library from './library';
import style from './style.module.css';

// This is the class management tab, for creating and deleting classes.
function ClassTab() {
  const { studentContract, getAllClasses, registerClass, deleteClasses } =
    useStudentManagement();
  const { getClass, addClass, deleteClass } = useClassService();
  const [classes, setClasses] = useState([]);
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!studentContract) return;

    handleOnRefresh();
  }, [studentContract]);

  // This is the function that is called when the user clicks the submit button.
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

  // This is the function that is called when the user clicks the refresh button, or the page is reloaded.
  async function handleOnRefresh() {
    setIsLoading(true);

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

    setIsLoading(false);
  }

  // This is the function that is called when the user clicks the delete button.
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
      <header className={style.header}>
        <h2>Class Management</h2>
      </header>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Management
            list={classes}
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

export default ClassTab;
