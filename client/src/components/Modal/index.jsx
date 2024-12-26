import style from './style.module.css';

// This is a simple modal component.
// It is used to display content in a modal.
function Modal({ children, title, subTitle, setShowModal }) {
  const handleBackgroundClick = (e) => {
    // Close modal when clicking on the background.
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
            {title && <h3>{title}</h3>}

            {subTitle && <span>{subTitle}</span>}
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
