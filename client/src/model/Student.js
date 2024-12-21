import User from './User';

class Student extends User {
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
      role: 'student',
    });

    this.classID = classID;
  }
}

export default Student;
