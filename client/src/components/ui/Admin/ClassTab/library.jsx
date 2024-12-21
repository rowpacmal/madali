import Input from '../../../Input';
import ListItem from '../../../ListItem';

const library = {
  maxInputs: 5,

  createInputObject: function () {
    return {
      index: Date.now(),
      code: '',
      name: 'Class 2024',
      year: '2024',
    };
  },

  createFormInputs: function (
    formInput,
    index,
    style,
    handleInputOnChange,
    handleDeleteInput
  ) {
    return (
      <div key={formInput.index} className={style.inputsContainer}>
        <div className={style.inputs}>
          <Input
            type="number"
            placeholder="Enter class code..."
            label="Class Code"
            value={formInput.code}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'code', e.target.value)
            }
          />

          <Input
            placeholder="Enter name..."
            label="Name"
            value={formInput.name}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'name', e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Enter year..."
            label="Year"
            value={formInput.year}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'year', e.target.value)
            }
          />
        </div>

        <div>
          <button
            type="button"
            className={style.delete}
            onClick={() => handleDeleteInput(formInput.index)}
          >
            Remove
          </button>
        </div>
      </div>
    );
  },

  createListBody: function (
    item,
    index,
    style,
    selections,
    handleSelectionOnChange
  ) {
    return (
      <li key={item.id} className={style.li}>
        <div className={style.checkbox}>
          <input
            type="checkbox"
            checked={selections[item.id]}
            onChange={(e) => handleSelectionOnChange(item.id, e.target.checked)}
          />

          <span>Select</span>
        </div>

        <div className={style.liBody}>
          <ListItem label="Code">{item.id}</ListItem>

          <ListItem label="Name">{item.name}</ListItem>

          <ListItem label="Year">{item.year}</ListItem>
        </div>
      </li>
    );
  },
};

export default library;
