import { useEffect, useState } from 'react';

function GradeItem({ grade, style }) {
  const [editing, setEditing] = useState(false);

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

  return (
    <li className={style.li}>
      <div className={style.module}>
        <span>{grade.module}</span>

        <input
          type="text"
          value={editing}
          className={style.input}
          disabled={editing === '-'}
          onChange={(e) => setEditing(e.target.value)}
        />
      </div>

      <div className={style.buttons}>
        <button
          type="button"
          disabled={grade.id === null || editing === renderGrades(grade.grade)}
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
