// frontend/src/components/Input.jsx
import React from 'react';
import './Input.scss'; // Импортируем стили для этого компонента

// Переиспользуемый компонент поля ввода формы
function Input({ label, id, type = 'text', value, onChange, ...props }) {
  // label: Текст метки поля
  // id: ID поля ввода (для связки с label и уникальности)
  // type: Тип поля (text, password, email и т.д.), по умолчанию 'text'
  // value: Текущее значение поля (делает его контролируемым компонентом)
  // onChange: Обработчик события изменения значения поля
  // ...props: Остальные пропсы, переданные компоненту (например, placeholder, required, minLength и т.д.)

  return (
    <div className="form-group"> {/* Контейнер для метки и поля ввода */}
      {/* Если пропс label передан и не пустой, отображаем метку */}
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="form-input" // Класс для стилизации самого поля ввода
        {...props} // Передаем остальные пропсы элементу <input>
      />
    </div>
  );
}

export default Input; // Экспорт компонента по умолчанию