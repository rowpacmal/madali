import Input from '../../../Input';
import ListItem from '../../../ListItem';

const library = {
  maxInputs: 3,

  createInputObject: function () {
    return {
      index: Date.now(),
      walletAddress: '',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: 'John Doe Street 12',
      phoneNumber: '+55 555 555 555',
      classID: '',
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
            placeholder="Enter wallet address..."
            label="Wallet Address"
            value={formInput.walletAddress}
            onChange={(e) =>
              handleInputOnChange(
                formInput.index,
                'walletAddress',
                e.target.value
              )
            }
          />

          <Input
            placeholder="Enter first name..."
            label="First Name"
            value={formInput.firstName}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'firstName', e.target.value)
            }
          />

          <Input
            placeholder="Enter last name..."
            label="Last Name"
            value={formInput.lastName}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'lastName', e.target.value)
            }
          />

          <Input
            type="email"
            placeholder="Enter email..."
            label="Email"
            value={formInput.email}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'email', e.target.value)
            }
          />

          <Input
            placeholder="Enter address..."
            label="Address"
            value={formInput.address}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'address', e.target.value)
            }
          />

          <Input
            type="tel"
            placeholder="Enter phone number..."
            label="Phone Number"
            value={formInput.phoneNumber}
            onChange={(e) =>
              handleInputOnChange(
                formInput.index,
                'phoneNumber',
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Enter class code..."
            label="Class Code"
            value={formInput.classID}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'classID', e.target.value)
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
          <ListItem label="Wallet Address">{item.id}</ListItem>

          <ListItem label="First Name">{item.firstName}</ListItem>

          <ListItem label="Last Name">{item.lastName}</ListItem>

          <ListItem label="Email">{item.email}</ListItem>

          <ListItem label="Address">{item.address}</ListItem>

          <ListItem label="Phone Number">{item.phoneNumber}</ListItem>

          <ListItem label="Class">{item.classID}</ListItem>
        </div>
      </li>
    );
  },
};

export default library;
