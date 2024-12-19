import Person from './Person';

class User extends Person {
  constructor({ id, firstName, lastName, email, address, phoneNumber, role }) {
    super({ firstName, lastName, email, address, phoneNumber });

    this.id = id; // ETH wallet address
    this.role = role;
  }
}

export default User;
