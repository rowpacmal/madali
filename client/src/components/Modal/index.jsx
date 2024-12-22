import style from './style.module.css';

function Modal({ children, title, subTitle, setShowModal }) {
  const handleBackgroundClick = (e) => {
    if (e.target.id === 'background') {
      setShowModal(false);
    }
  };

  return (
    <div
      id="background"
      className={style.modal}
      onClick={handleBackgroundClick}
    >
      <div className={style.modalContent}>
        <header className={style.header}>
          <div className={style.title}>
            <h3>{title}</h3>

            <span>{subTitle}</span>
          </div>

          <button
            type="button"
            className={style.close}
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

export default Modal;
