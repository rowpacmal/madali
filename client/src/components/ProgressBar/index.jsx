import style from './style.module.css';

// This is a simple progress bar component.
const ProgressBar = ({ progress }) => {
  return (
    <div className={style.progressbar}>
      <div
        style={{
          width: `${progress}%`,
        }}
        className={style.progress}
      />
    </div>
  );
};

export default ProgressBar;
