import style from './style.module.css';

function Input({ type = 'text', placeholder, label, value, onChange }) {
  return (
    <label className={style.label}>
      <span>{label}</span>

      <input
        type={type}
        placeholder={placeholder}
        {...(type === 'number' && { min: 0 })}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}

export default Input;
