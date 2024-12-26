import style from './style.module.css';

// This is a simple list item component.
function ListItem({ children, label }) {
  return (
    <div className={style.container}>
      <span className={style.label}>{label}</span>
      <span className={style.content}>{children}</span>
    </div>
  );
}

export default ListItem;
