// frontend/src/components/Button.jsx
import React from 'react';
import './Button.scss'; // Импортируем стили для этого компонента

// Переиспользуемый компонент кнопки
function Button({ children, type = 'button', onClick, variant = 'primary', disabled, ...props }) {
  // children: Содержимое кнопки (обычно текст)
  // type: Тип кнопки ('button', 'submit', 'reset'), по умолчанию 'button'
  // onClick: Обработчик клика
  // variant: Вариант стиля кнопки ('primary', 'secondary', 'medical-blue', 'link' и т.д.), по умолчанию 'primary'
  // disabled: Булево значение, делает кнопку неактивной и меняет ее вид
  // ...props: Остальные пропсы, переданные компоненту

  return (
    <button
      type={type}
      onClick={onClick}
      // Формируем классы для стилизации: всегда 'btn' и 'btn-' + значение variant
      className={`btn btn-${variant}`}
      disabled={disabled} // Применяем состояние disabled
      {...props} // Передаем остальные пропсы элементу <button>
    >
      {children} {/* Вставляем содержимое кнопки */}
    </button>
  );
}

export default Button; // Экспорт компонента по умолчанию