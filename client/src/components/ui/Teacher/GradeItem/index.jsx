import { useEffect, useState } from 'react';
import useGradingSystem from '../../../../hooks/useGradingSystem';
import useEducationCertificate from '../../../../hooks/useEducationCertificate';
import axios from 'axios';
import jsonServer from '../../../../utils/jsonServer.config';

// This component is used to display a grade item in the grades modal.
function GradeItem({ student, course, grade, style }) {
  const { updateGrade } = useGradingSystem();
  const {
    certificateContract,
    mintCertificate,
    getCertificate,
    getTotalCertificates,
  } = useEducationCertificate();
  const [editing, setEditing] = useState('-');
  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    if (!grade) return;

    setEditing(renderGrades(grade.grade));
  }, [grade]);

  // Check if the certificate is minted.
  useEffect(
    () => {
      (async () => {
        const totalCertificates = await getTotalCertificates();

        for (let i = 0; i < totalCertificates; i++) {
          const certificate = await getCertificate(i);

          if (certificate.grade === grade.id) {
            setIsMinted(true);
          }
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [certificateContract, grade]
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

  // Function to handle the save/update button.
  async function handleOnSave(id, grade) {
    if (id === null || id === undefined) return;

    let newGrade = 0;

    switch (grade.toLocaleUpperCase()) {
      case 'A':
        newGrade = 6;
        break;

      case 'B':
        newGrade = 5;
        break;

      case 'C':
        newGrade = 4;
        break;

      case 'D':
        newGrade = 3;
        break;

      case 'E':
        newGrade = 2;
        break;

      case 'F':
        newGrade = 1;
        break;

      default:
        newGrade = 0;
        break;
    }

    console.log(id, grade, newGrade);

    await updateGrade(Number(id), Number(newGrade));

    setEditing(grade);
  }

  // Function to handle the mint button.
  async function handleOnMint() {
    try {
      const response = await axios.get(`${jsonServer.url}/badges`);
      const badges = await response.data;
      let imageURL = '';

      console.log(badges);

      for (let badge of badges) {
        if (Number(badge.course) === Number(course)) {
          imageURL = badge.url;
        }
      }

      await mintCertificate(student, grade.id, course, imageURL);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <li className={style.li + (grade.id === null ? ' ' + style.disabled : '')}>
      <div className={style.module}>
        <span>{grade.id !== null ? (isMinted ? 'Yes' : 'No') : '-'}</span>

        <span>{grade.id !== null ? grade.id : '-'}</span>

        <span>{grade.module}</span>

        <div>
          <input
            type="text"
            value={editing}
            placeholder="-"
            className={style.input}
            disabled={editing === '-'}
            onChange={(e) => setEditing(e.target.value)}
          />
        </div>
      </div>

      <div className={style.buttons}>
        <button
          type="button"
          disabled={grade.id === null || editing === renderGrades(grade.grade)}
          onClick={() => handleOnSave(grade.id, editing)}
        >
          Update
        </button>

        <button
          type="button"
          disabled={grade.id === null || isMinted}
          onClick={() => handleOnMint()}
        >
          Mint
        </button>
      </div>
    </li>
  );
}

export default GradeItem;
