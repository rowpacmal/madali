import style from './style.module.css';

function Form({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className={style.form}>
      {children}
    </form>
  );
}

export default Form;
