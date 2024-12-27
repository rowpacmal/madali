import { useEffect, useState } from 'react';
import Modal from '../../../Modal';
import style from './style.module.css';
import educationCertificate from '../../../../utils/educationCertificate.config';
import useCourseService from '../../../../services/useCourseService';
import useTeacherService from '../../../../services/useTeacherService';
import useStudentService from '../../../../services/useStudentService';

// This component is used to display a badge item in the badges modal.
function ViewItem({ label, data }) {
  return (
    <li className={style.li}>
      <span className={style.label}>{label}</span>

      <span className={style.item}>{data}</span>
    </li>
  );
}

// This component is used to display a badge modal.
function BadgeModal({ data, setShowModal }) {
  const { getCourse } = useCourseService();
  const { getTeacher } = useTeacherService();
  const { getStudent } = useStudentService();
  const [courseName, setCourseName] = useState('N/A');
  const [teacherName, setTeacherName] = useState('N/A');
  const [studentName, setStudentName] = useState('N/A');
  const [isLoading, setIsLoading] = useState(false);

  // This is used to get the course name, teacher name, and student name.
  useEffect(
    () => {
      if (!data) return;

      (async () => {
        setIsLoading(true);

        const course = await getCourse(data.course);
        const teacher = await getTeacher(data.teacher);
        const student = await getStudent(data.student);

        setCourseName(course.name);
        setTeacherName(`${teacher.firstName} ${teacher.lastName}`);
        setStudentName(`${student.firstName} ${student.lastName}`);

        setIsLoading(false);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  // Utility function to render the grade.
  function renderGrades(grade) {
    switch (grade) {
      case 6:
        return 'A';
      case 5:
        return 'B';
      case 4:
        return 'C';
      case 3:
        return 'D';
      case 2:
        return 'E';
      case 1:
        return 'F';

      case 0:
      default:
        return '-';
    }
  }

  return (
    <Modal title="Badge Details" setShowModal={setShowModal}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <img
            src={`/${data.imageURL}`}
            alt=""
            className={style.image}
            loading="lazy"
            width="240"
            height="240"
          />

          <div className={style.ulContainer}>
            <ul className={style.ul}>
              <ViewItem
                label="Contract Address"
                data={educationCertificate.address}
              />

              <ViewItem label="Certificate ID" data={data.certificate} />

              <ViewItem label="NFT Owner" data={data.owner} />

              <ViewItem label="Course" data={courseName} />

              <ViewItem label="Course Code" data={data.course} />

              <ViewItem label="Teacher" data={teacherName} />

              <ViewItem label="Teacher Wallet" data={data.teacher} />

              <ViewItem label="Student" data={studentName} />

              <ViewItem label="Student Wallet" data={data.student} />

              <ViewItem label="Grade ID" data={data.id} />

              <ViewItem label="Grade" data={renderGrades(data.grade)} />

              <ViewItem label="Module" data={data.module} />
            </ul>
          </div>
        </>
      )}
    </Modal>
  );
}

export default BadgeModal;
