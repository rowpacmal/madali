import User from './User';

class Teacher extends User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
    classID,
  }) {
    super({
      id,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      role: 'teacher',
    });

    this.classID = classID;
  }
}

export default Teacher;
