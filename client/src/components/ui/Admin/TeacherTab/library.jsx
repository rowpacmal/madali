import { SquareRoundedMinusFilled } from '../../../icons/SquareRoundedMinus';
import Input from '../../../Input';

const library = {
  maxInputs: 3,

  createInputObject: function () {
    return {
      index: Date.now(),
      walletAddress: '',
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      phoneNumber: '',
    };
  },

  createForm: function (
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
            placeholder="Enter teacher wallet address..."
            label="Teacher Wallet Address"
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
            placeholder="Enter teacher first name..."
            label="Teacher First Name"
            value={formInput.firstName}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'firstName', e.target.value)
            }
          />

          <Input
            placeholder="Enter teacher last name..."
            label="Teacher Last Name"
            value={formInput.lastName}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'lastName', e.target.value)
            }
          />

          <Input
            type="email"
            placeholder="Enter teacher email..."
            label="Teacher Email"
            value={formInput.email}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'email', e.target.value)
            }
          />

          <Input
            placeholder="Enter teacher address..."
            label="Teacher Address"
            value={formInput.address}
            onChange={(e) =>
              handleInputOnChange(formInput.index, 'address', e.target.value)
            }
          />

          <Input
            type="tel"
            placeholder="Enter teacher phone number..."
            label="Teacher Phone Number"
            value={formInput.phoneNumber}
            onChange={(e) =>
              handleInputOnChange(
                formInput.index,
                'phoneNumber',
                e.target.value
              )
            }
          />
        </div>

        <div>
          <button
            type="button"
            className={style.delete + ' ' + style.button}
            onClick={() => handleDeleteInput(formInput.index)}
          >
            <SquareRoundedMinusFilled size={32} />
          </button>
        </div>
      </div>
    );
  },

  createListHeader: function (list, style, handleSelectAllSelections) {
    return (
      <>
        <div className={style.checkbox}>
          <input
            type="checkbox"
            disabled={list.length === 0}
            onChange={handleSelectAllSelections}
          />

          <span>Wallet Address</span>
        </div>

        <span>First Name</span>

        <span>Last Name</span>

        <span>Email</span>

        <span>Address</span>

        <span>Phone Number</span>
      </>
    );
  },

  createListBody: function () {
    return null;
  },
};

export default library;
