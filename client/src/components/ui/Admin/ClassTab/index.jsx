import { useEffect, useState } from 'react';
import useStudentManagement from '../../../../hooks/useStudentManagement';
import useClassService from '../../../../services/useClassService';
import Form from '../../../Form';
import Input from '../../../Input';
import { SquareRoundedPlusFilled } from '../../../icons/SquareRoundedPlus';
import { SquareRoundedMinusFilled } from '../../../icons/SquareRoundedMinus';
import Class from '../../../../model/Class';

import style from './style.module.css';

function ClassTab() {
  const { studentContract, getAllClasses, registerClass, deleteClasses } =
    useStudentManagement();
  const { getClass, addClass, deleteClass } = useClassService();
  const [classes, setClasses] = useState([]);
  const [classToAdd, setClassToAdd] = useState([]);
  const [deletion, setDeletion] = useState({});

  useEffect(() => {
    if (!studentContract) return;

    fetchClasses();
  }, [studentContract]);

  async function fetchClasses() {
    const tempClasses = [];
    const tempSelected = {};
    const classIDs = await getAllClasses();

    for (let classID of classIDs) {
      const classData = await getClass(classID);

      tempClasses.push(classData);

      tempSelected[classID] = false;
    }

    console.log(tempClasses);
    console.log(tempSelected);

    setClasses(tempClasses);
    setDeletion(tempSelected);
  }

  function handleOnChange(index, field, value) {
    setClassToAdd((prevState) =>
      prevState.map((c) => {
        if (c.index === index) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  }

  function handleSelectedOnChange(index, value) {
    setDeletion((prevState) => {
      return {
        ...prevState,
        [index]: value,
      };
    });
  }

  async function handleDeleteSelected() {
    console.log(deletion);

    const classIDs = Object.keys(deletion).filter((key) => deletion[key]);

    console.log(classIDs);

    try {
      await deleteClasses(classIDs);

      for (let classID of classIDs) {
        await deleteClass(classID);
      }

      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit() {
    const classIDs = classToAdd.map((c) => Number(c.code));

    try {
      await registerClass(classIDs);

      for (let c of classToAdd) {
        await addClass(
          new Class({
            id: c.code,
            name: c.name,
            year: c.year,
          })
        );
      }

      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  }

  function handleAddClass() {
    setClassToAdd((prevState) => [
      ...prevState,
      {
        index: Date.now(),
        code: '',
        name: '',
        year: '',
      },
    ]);
  }

  function handleDeleteClass(index) {
    setClassToAdd((prevState) => prevState.filter((c) => c.index !== index));
  }

  return (
    <section>
      <header>
        <h2>Classes</h2>
      </header>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        buttonText="Register Classes"
      >
        {classToAdd.length === 0 && (
          <p className={style.noClasses}>
            No classes to register. Click the button to add a new class.
          </p>
        )}

        {classToAdd.map((c) => (
          <div key={c.index} className={style.inputs}>
            <Input
              type="number"
              placeholder="Enter class code..."
              label="Class Code"
              value={c.code}
              onChange={(e) => handleOnChange(c.index, 'code', e.target.value)}
            />

            <Input
              placeholder="Enter class name..."
              label="Class Name"
              value={c.name}
              onChange={(e) => handleOnChange(c.index, 'name', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Enter class year..."
              label="Class Year"
              value={c.year}
              onChange={(e) => handleOnChange(c.index, 'year', e.target.value)}
            />

            <div>
              <button
                type="button"
                className={style.delete + ' ' + style.button}
                onClick={() => handleDeleteClass(c.index)}
              >
                <SquareRoundedMinusFilled size={32} />
              </button>
            </div>
          </div>
        ))}

        <div className={style.buttons}>
          <button type="submit" disabled={!classToAdd.length}>
            Register
          </button>

          <button
            type="button"
            className={style.add + ' ' + style.button}
            disabled={classToAdd.length >= 5}
            onClick={handleAddClass}
          >
            <SquareRoundedPlusFilled size={32} />
          </button>
        </div>
      </Form>

      <div>
        <ul className={style.ul}>
          <li key="header" className={style.liHeader}>
            <div className={style.checkbox}>
              <input
                type="checkbox"
                disabled={classes.length === 0}
                onChange={(e) => {
                  const { checked } = e.target;

                  function checkAll(prevState, checked) {
                    const temp = { ...prevState };

                    for (let key in temp) {
                      temp[key] = checked;
                    }

                    return temp;
                  }

                  if (checked) {
                    setDeletion((prevState) => checkAll(prevState, true));
                  } else {
                    setDeletion((prevState) => checkAll(prevState, false));
                  }
                }}
              />

              <span>Code</span>
            </div>

            <span>Name</span>

            <span>Year</span>
          </li>

          {classes.length === 0 && (
            <li key="noClasses" className={style.noClasses}>
              No classes to display.
            </li>
          )}

          {classes.map((classID) => (
            <li key={classID.id} className={style.li}>
              <div className={style.checkbox}>
                <input
                  type="checkbox"
                  checked={deletion[classID.id]}
                  onChange={(e) =>
                    handleSelectedOnChange(classID.id, e.target.checked)
                  }
                />

                <span>{classID.id}</span>
              </div>

              <span>{classID.name}</span>

              <span>{classID.year}</span>
            </li>
          ))}
        </ul>

        <div className={style.selections}>
          <button
            type="button"
            disabled={!Object.values(deletion).includes(true)}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
      </div>
    </section>
  );
}

export default ClassTab;
