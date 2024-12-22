import Input from '../../../Input';
import ListItem from '../../../ListItem';

const library = {
  isManageable: true,
  maxInputs: 3,
  selectionMode: 'multiple',

  createInputObject: function () {
    return {
      index: Date.now(),
      code: '',
      name: 'Class 2024, Course A',
      courseClass: 2401,
      modules: 10,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
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
            placeholder="Enter course code..."
            label="Course Code"
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
            type="date"
            placeholder="Enter start date..."
            label="Start Date"
            value={formInput.startDate}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'startDate', e.target.value)
            }
          />

          <Input
            type="date"
            placeholder="Enter end date..."
            label="End Date"
            value={formInput.endDate}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'endDate', e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Enter modules..."
            label="Modules"
            value={formInput.modules}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'modules', e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Enter class code..."
            label="Class Code"
            value={formInput.courseClass}
            onChange={(e) =>
              handleInputOnChange(
                formInput.index,
                'courseClass',
                e.target.value
              )
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

  createListItems: function (item, index, style) {
    return (
      <div className={style.liBody}>
        <ListItem label="Course Code">{item.id}</ListItem>

        <ListItem label="Name">{item.name}</ListItem>

        <ListItem label="Class">{item.courseClass}</ListItem>
      </div>
    );
  },
};

export default library;
