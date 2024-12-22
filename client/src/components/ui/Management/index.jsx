import Form from '../../Form';

import style from './style.module.css';

function Management({
  list,
  library,

  formInputs,
  setFormInputs,
  selections,
  setSelections,

  handleOnSubmit,
  handleOnRefresh,
  handleOnView,
  handleOnDelete,
  handleOnUpdate,
}) {
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

  function getSelectionMode(mode) {
    switch (mode) {
      case 'single':
        return (
          Object.values(selections).filter(Boolean).length === 0 ||
          Object.values(selections).filter(Boolean).length >= 2
        );

      case 'multiple':
        return !Object.values(selections).includes(true);

      default:
        return true;
    }
  }

  return (
    <div>
      {library.isManageable && (
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
              library.createFormInputs(
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
            {library.isSelectable && (
              <div className={style.checkbox}>
                <input
                  type="checkbox"
                  disabled={list.length === 0}
                  onChange={handleSelectAllSelections}
                />

                <span>Select All</span>
              </div>
            )}

            <div className={style.buttons + ' ' + style.refresh}>
              {handleOnDelete && (
                <button
                  type="button"
                  disabled={getSelectionMode(library.selectionMode)}
                  onClick={handleOnDelete}
                >
                  Delete Selected
                </button>
              )}

              <button type="button" onClick={() => handleOnRefresh()}>
                Refresh
              </button>
            </div>
          </li>

          {list.length === 0 && (
            <li key="noClasses" className={style.noClasses}>
              No data to display.
            </li>
          )}

          {list.map((item, index) => (
            <li key={item.id} className={style.li}>
              {library.isSelectable && (
                <div className={style.checkbox}>
                  <input
                    type="checkbox"
                    checked={selections[item.id]}
                    onChange={(e) =>
                      handleSelectionOnChange(item.id, e.target.checked)
                    }
                  />

                  <span>Select</span>
                </div>
              )}

              {library.createListItems(item, index, style)}

              {(handleOnUpdate || handleOnView) && (
                <div className={style.buttons}>
                  {handleOnUpdate && (
                    <button type="button" onClick={() => handleOnUpdate(item)}>
                      Update
                    </button>
                  )}

                  {handleOnView && (
                    <button type="button" onClick={() => handleOnView(item)}>
                      View
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Management;
