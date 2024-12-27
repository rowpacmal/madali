import { useEffect, useState } from 'react';
import useEducationCertificate from '../../../../hooks/useEducationCertificate';

// This component is used to display a grade item in the students grades modal.
function GradeItem({ grade, style }) {
  const { certificateContract, getCertificate, getTotalCertificates } =
    useEducationCertificate();
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
            readOnly
          />
        </div>
      </div>
    </li>
  );
}

export default GradeItem;
