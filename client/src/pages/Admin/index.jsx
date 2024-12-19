import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import useStudentManagement from '../../hooks/useStudentManagement';
import useTeacherManagement from '../../hooks/useTeacherManagement';
import { UserRoleContext } from '../../contexts/UserRoleContext';
import { useNavigate } from 'react-router-dom';
import useGradingSystem from '../../hooks/useGradingSystem';
import useEducationCertificate from '../../hooks/useEducationCertificate';
import { AppContext } from '../../contexts/AppContext';

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
};

function Admin() {
  const navigate = useNavigate();
  const {
    getAllCoursesByTeacher,
    getCourse,
    getTotalCoursesByTeacher,

    deleteCourses,
    registerCourses,

    getAllTeachers,
    getTeacher,
    getTotalTeachers,

    deleteTeachers,
    registerTeachers,
    updateTeacher,
  } = useTeacherManagement();
  const {
    getAllClasses,
    getTotalClasses,

    addClass,
    deleteClasses,

    getAllStudents,
    getStudent,
    getTotalStudents,

    deleteStudents,
    registerStudents,
    updateStudent,
  } = useStudentManagement();
  const {
    getAllGradesByStudent,
    getGrade,
    getTotalGradesByStudent,

    addGrades,
    deleteGrade,
    updateGrade,
  } = useGradingSystem();
  const {
    certificateContract,

    getCertificate,
    getTotalCertificates,

    mintCertificate,
    updateCertificate,
  } = useEducationCertificate();
  const { account } = useContext(AppContext);
  const { userRole } = useContext(UserRoleContext);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!userRole) {
      return;
    }

    if (userRole !== 'Admin') {
      navigate('/');
    }
  }, [navigate, userRole]);

  return (
    <>
      {userRole === 'Admin' && (
        <>
          <h2>Admin</h2>

          <div>
            {img && (
              <img src={img} style={{ width: '100px', height: '100px' }} />
            )}
          </div>

          <button
            onClick={async () => {
              const totalCert = await getTotalCertificates();

              for (let i = 0; i < totalCert; i++) {
                const owner = await certificateContract.read.ownerOf(i);
                console.log('Owner of Certificate ID:', owner);

                if (owner.toLowerCase() === account.toLowerCase()) {
                  console.log('Found owner');
                  const uri = await certificateContract.read.tokenURI(3);
                  const metadata = (await axios.get(uri)).data;
                  console.log('Metadata:', metadata);

                  metadata && setImg(metadata.image);
                } else {
                  console.log('Not found');
                }
              }
            }}
          >
            Check Cert Owner
          </button>

          {/* Certificates */}
          <div style={style}>
            <h3>Certificate Management</h3>

            <div style={style}>
              <button
                onClick={() => {
                  getCertificate(0);
                }}
              >
                Get Certificate
              </button>

              <button onClick={getTotalCertificates}>
                Get Total Number of Certificates
              </button>
            </div>

            <div style={style}>
              <button
                onClick={() => {
                  mintCertificate(
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                    0,
                    240103,
                    'https://cdn-icons-png.flaticon.com/512/6024/6024706.png',
                    'https://gateway.pinata.cloud/ipfs/bafkreigmjpiryicoxyufhlflfzb5gt2pp2jsnclv4ty7ktj36thad7xpqe'
                  );
                }}
              >
                Mint Certificate
              </button>

              <button
                onClick={() => {
                  updateCertificate(
                    0,
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                    'https://cdn-icons-png.flaticon.com/512/6024/6024708.png'
                  );
                }}
              >
                Update Certificate
              </button>
            </div>
          </div>

          <hr />

          {/* Grades */}
          <div style={style}>
            <h3>Grade Management</h3>

            <div style={style}>
              <button
                onClick={async () => {
                  getAllGradesByStudent(
                    (await getAllStudents((await getAllClasses())[0]))[0]
                  );
                }}
              >
                Get All Grades
              </button>

              <button
                onClick={async () => {
                  getGrade(
                    (
                      await getAllGradesByStudent(
                        (
                          await getAllStudents((await getAllClasses())[0])
                        )[0]
                      )
                    )[0]
                  );
                }}
              >
                Get Grade
              </button>

              <button
                onClick={async () => {
                  getTotalGradesByStudent(
                    (await getAllStudents((await getAllClasses())[0]))[0]
                  );
                }}
              >
                Get Total Number of Grades
              </button>
            </div>

            <div style={style}>
              <button
                onClick={() => {
                  addGrades(
                    240103,
                    1,
                    ['0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'],
                    [4]
                  );
                }}
              >
                Add Grades
              </button>

              <button
                onClick={async () => {
                  deleteGrade(0);
                }}
              >
                Delete Grade
              </button>

              <button
                onClick={() => {
                  updateGrade(0, 6);
                }}
              >
                Update Grade
              </button>
            </div>
          </div>

          <hr />

          {/* Students */}
          <div style={style}>
            <h3>Student Management</h3>

            <div style={style}>
              <button
                onClick={async () => {
                  getAllStudents((await getAllClasses())[0]);
                  getAllStudents((await getAllClasses())[1]);
                }}
              >
                Get All Students
              </button>

              <button
                onClick={async () => {
                  getStudent(
                    (await getAllStudents((await getAllClasses())[0]))[0]
                  );
                  getStudent(
                    (await getAllStudents((await getAllClasses())[1]))[0]
                  );
                }}
              >
                Get Student
              </button>

              <button
                onClick={async () => {
                  getTotalStudents((await getAllClasses())[0]);
                  getTotalStudents((await getAllClasses())[1]);
                }}
              >
                Get Total Number of Students
              </button>
            </div>

            <div style={style}>
              <button
                onClick={async () =>
                  registerStudents((await getAllClasses())[0], [
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                  ])
                }
              >
                Add Students
              </button>

              <button
                onClick={async () => {
                  deleteStudents((await getAllClasses())[0], [
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                  ]);
                  deleteStudents((await getAllClasses())[1], [
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                  ]);
                }}
              >
                Delete Students
              </button>

              <button
                onClick={async () =>
                  updateStudent(
                    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
                    2401,
                    2402
                  )
                }
              >
                Update Student
              </button>
            </div>
          </div>

          <hr />

          {/* Classes */}
          <div style={style}>
            <h3>Class Management</h3>

            <div style={style}>
              <button onClick={getAllClasses}>Get All Classes</button>

              <button onClick={getTotalClasses}>
                Get Total Number of Classes
              </button>
            </div>

            <div style={style}>
              <button onClick={() => addClass([2401, 2402])}>
                Add Classes
              </button>

              <button onClick={() => deleteClasses([2401, 2402])}>
                Delete Classes
              </button>
            </div>
          </div>

          <hr />

          {/* Courses */}
          <div style={style}>
            <h3>Course Management</h3>

            <div style={style}>
              <button
                onClick={async () =>
                  getAllCoursesByTeacher((await getAllTeachers())[0])
                }
              >
                Get All Courses
              </button>

              <button
                onClick={async () =>
                  getCourse(
                    (
                      await getAllCoursesByTeacher((await getAllTeachers())[0])
                    )[0]
                  )
                }
              >
                Get Course
              </button>

              <button
                onClick={async () =>
                  getTotalCoursesByTeacher((await getAllTeachers())[0])
                }
              >
                Get Total Number of Courses
              </button>
            </div>

            <div style={style}>
              <button
                onClick={async () =>
                  registerCourses(
                    (await getAllTeachers())[0],
                    [240103],
                    [2401],
                    [10]
                  )
                }
              >
                Add Courses
              </button>

              <button
                onClick={async () =>
                  deleteCourses((await getAllTeachers())[0], [240103])
                }
              >
                Delete Courses
              </button>
            </div>
          </div>

          <hr />

          {/* Teachers */}
          <div style={style}>
            <h3>Teacher Management</h3>

            <div style={style}>
              <button onClick={getAllTeachers}>Get All Teachers</button>

              <button
                onClick={async () => getTeacher((await getAllTeachers())[0])}
              >
                Get Teacher
              </button>

              <button onClick={getTotalTeachers}>
                Get Total Number of Teachers
              </button>
            </div>

            <div style={style}>
              <button
                onClick={() =>
                  registerTeachers(
                    ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'],
                    [2401]
                  )
                }
              >
                Add Teachers
              </button>

              <button
                onClick={() =>
                  deleteTeachers(['0x70997970c51812dc3a010c7d01b50e0d17dc79c8'])
                }
              >
                Delete Teachers
              </button>

              <button
                onClick={() =>
                  updateTeacher(
                    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
                    2402
                  )
                }
              >
                Update Teacher
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Admin;
