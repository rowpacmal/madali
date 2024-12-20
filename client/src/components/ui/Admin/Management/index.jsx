import { useState } from 'react';
import { SquareRoundedPlusFilled } from '../../../icons/SquareRoundedPlus';
import Form from '../../../Form';

import style from './style.module.css';

function Management({
  heading,
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
    setFormInputs((prevState) => [...prevState, library.inputObject]);
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
    <section>
      <header>
        <h2>{heading}</h2>
      </header>

      {isManager && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          {formInputs.length === 0 && (
            <p className={style.noClasses}>
              No items to register. Click the button to add a new class.
            </p>
          )}

          {formInputs.map((formInput, index) =>
            library.createForm(
              formInput,
              index,
              style,
              handleInputOnChange,
              handleDeleteInput
            )
          )}

          <div className={style.buttons}>
            <button type="submit" disabled={!formInputs.length}>
              Register
            </button>

            <button
              type="button"
              className={style.add + ' ' + style.button}
              disabled={formInputs.length >= 5}
              onClick={handleAddInput}
            >
              <SquareRoundedPlusFilled size={32} />
            </button>
          </div>
        </Form>
      )}

      <div>
        <ul className={style.ul}>
          <li key="header" className={style.liHeader}>
            {library.createListHeader(list, style, handleSelectAllSelections)}
          </li>

          {list.length === 0 && (
            <li key="noClasses" className={style.noClasses}>
              No items to display.
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
    </section>
  );
}

export default Management;
