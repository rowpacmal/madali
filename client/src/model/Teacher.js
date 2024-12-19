import User from './User';

class Teacher extends User {
  constructor({ id, firstName, lastName, email, address, phoneNumber }) {
    super({
      id,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      role: 'teacher',
    });
  }
}

export default Teacher;
