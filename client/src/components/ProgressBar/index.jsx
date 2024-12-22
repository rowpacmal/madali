import style from './style.module.css';

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
