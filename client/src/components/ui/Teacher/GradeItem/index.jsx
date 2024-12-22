import { useEffect, useState } from 'react';
import useGradingSystem from '../../../../hooks/useGradingSystem';

function GradeItem({ grade, style }) {
  const [editing, setEditing] = useState(false);
  const { updateGrade } = useGradingSystem();

  useEffect(() => {
    if (!grade) return;

    setEditing(renderGrades(grade.grade));
  }, [grade]);

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

  return (
    <li className={style.li + (grade.id === null ? ' ' + style.disabled : '')}>
      <div className={style.module}>
        <span>{grade.id !== null ? grade.id : '-'}</span>

        <span>{grade.module}</span>

        <div>
          <input
            type="text"
            value={editing}
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
          Save
        </button>

        <button
          type="button"
          disabled={grade.id === null || editing === renderGrades(grade.grade)}
          onClick={() => setEditing(renderGrades(grade.grade))}
        >
          Cancel
        </button>
      </div>
    </li>
  );
}

export default GradeItem;
