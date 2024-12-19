import Person from './Person';
import User from './User';

class Student extends User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
    guardians,
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

    this.guardians = guardians.map((guardian) => new Person(guardian));
  }
}

export default Student;
