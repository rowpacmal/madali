import style from './style.module.css';

// This component is used to wrap a component in a form.
function Form({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className={style.form}>
      {children}
    </form>
  );
}

export default Form;
