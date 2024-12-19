class Course {
  constructor({ id, name, teacher, courseClass, modules, startDate, endDate }) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.courseClass = courseClass;
    this.modules = modules;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export default Course;
