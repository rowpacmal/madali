import { useState } from 'react';
import Form from '../../Form';

import style from './style.module.css';

function Management({
  list,
  library,
  isManager,

  handleOnSubmit,
  handleOnDelete,
  handleOnUpdate,
}) {
  const [formInputs, setFormInputs] = useState([]);
  const [selections, setSelections] = useState({});

  function handleInputOnChange(index, field, value) {
    setFormInputs((prevState) =>
      prevState.map((c) => {
        if (c.index === index) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  }

  function handleSelectionOnChange(index, value) {
    setSelections((prevState) => {
      return {
        ...prevState,
        [index]: value,
      };
    });
  }

  function handleAddInput() {
    setFormInputs((prevState) => [...prevState, library.createInputObject()]);
  }

  function handleDeleteInput(index) {
    setFormInputs((prevState) => prevState.filter((c) => c.index !== index));
  }

  function handleSelectAllSelections(e) {
    const { checked } = e.target;

    function checkAll(prevState, checked) {
      const temp = { ...prevState };

      for (let key in temp) {
        temp[key] = checked;
      }

      return temp;
    }

    if (checked) {
      setSelections((prevState) => checkAll(prevState, true));
    } else {
      setSelections((prevState) => checkAll(prevState, false));
    }
  }

  return (
    <div>
      {isManager && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          {formInputs.length === 0 && (
            <p className={style.noClasses}>
              No data to register. Click the button to add an item.
            </p>
          )}

          <div className={style.form}>
            {formInputs.map((formInput, index) =>
              library.createForm(
                formInput,
                index,
                style,
                handleInputOnChange,
                handleDeleteInput
              )
            )}
          </div>

          <div className={style.buttons}>
            <button type="submit" disabled={!formInputs.length}>
              Register
            </button>

            <button
              type="button"
              className={style.add}
              disabled={formInputs.length >= library.maxInputs}
              onClick={handleAddInput}
            >
              Add
            </button>
          </div>
        </Form>
      )}

      <div>
        <ul className={style.ul}>
          <li key="header" className={style.liHeader}>
            <div className={style.checkbox}>
              <input
                type="checkbox"
                disabled={list.length === 0}
                onChange={handleSelectAllSelections}
              />

              <span>Select All</span>
            </div>

            <button>Refresh</button>
          </li>

          {list.length === 0 && (
            <li key="noClasses" className={style.noClasses}>
              No data to display.
            </li>
          )}

          {list.map((item, index) =>
            library.createListBody(item, index, style, handleSelectionOnChange)
          )}
        </ul>

        {handleOnDelete && (
          <div className={style.selections}>
            <button
              type="button"
              disabled={!Object.values(selections).includes(true)}
              onClick={handleOnDelete}
            >
              Delete Selected
            </button>
          </div>
        )}

        {handleOnUpdate && (
          <div className={style.selections}>
            <button
              type="button"
              disabled={!Object.values(selections).includes(true)}
              onClick={handleOnUpdate}
            >
              Update Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Management;
