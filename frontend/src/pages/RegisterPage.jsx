// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для перенаправления
import Input from '../components/Input'; // Импортируем компонент Input
import Button from '../components/Button'; // Импортируем компонент Button
import useAuthStore from '../stores/authStore'; // Импортируем стор аутентификации


function RegisterPage() {
  // Состояния для полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient'); // По умолчанию 'patient'

  // Состояния для UI (ошибки, загрузка, успех)
  const [error, setError] = useState(null); // Локальное состояние для ошибок валидации формы или ошибок из стора
  const [isLoading, setIsLoading] = useState(false); // Флаг загрузки для кнопки
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Флаг успешной регистрации


  const navigate = useNavigate(); // Хук для программной навигации

  // Получаем функцию регистрации пользователя из стора
  const registerUser = useAuthStore((state) => state.registerUser);


  // Обработчик отправки формы регистрации
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы браузером

    setError(null); // Сбрасываем предыдущие ошибки

    // Базовая валидация на фронтенде: проверка совпадения паролей
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return; // Прерываем выполнение функции
    }
    // TODO: Добавить более строгую валидацию email (например, через regex или библиотеку)
    // TODO: Добавить валидацию сложности пароля, если требуется


    setIsLoading(true); // Включаем индикатор загрузки на кнопке

    try {
      // Вызываем функцию регистрации пользователя из стора
      // Эта функция асинхронна и возвращает промис
      const newUser = await registerUser(email, password, role);

      console.log('Registration successful', newUser);

      // Если регистрация прошла успешно, устанавливаем флаг успеха
      setRegistrationSuccess(true);

      // Опционально: автоматически перенаправить пользователя после успешной регистрации (например, на страницу входа)
      // setTimeout(() => {
      //   navigate('/login');
      // }, 5000); // Перенаправить через 5 секунд


    } catch (err) {
      // Ошибки из стора (например, ошибка с бэкенда) будут выброшены здесь.
      // Сообщение об ошибке уже установлено в состоянии стора (useAuthStore.getState().error).
      // console.error('Registration failed in component', err);

      // Получаем сообщение об ошибке непосредственно из стора после того, как оно там установилось в catch блока стора.
      // Этот подход гарантирует, что мы отображаем ошибку, которая пришла из стора.
      setError(useAuthStore.getState().error);
    } finally {
      // Этот блок выполняется в любом случае после try или catch
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };


  // Если регистрация успешно завершена, отображаем сообщение об успехе вместо формы
  if (registrationSuccess) {
    return (
      <div className="form-container">
        <h1>Регистрация</h1>
        <div style={{ textAlign: 'center' }}> {/* Центрируем текст внутри контейнера */}
            <p className="success-message"> {/* Используем класс для сообщений об успехе */}
                Вы успешно зарегистрированы!
            </p>
             <p style={{ marginBottom: '20px' }}> {/* Отступ снизу */}
                На вашу почту отправлена ссылка для подтверждения Email.
                Пожалуйста, перейдите по ней, чтобы активировать ваш аккаунт.
             </p>
            {/* Кнопка для перехода на страницу входа */}
            <Button variant="medical-blue" onClick={() => navigate('/login')}>Перейти на страницу входа</Button>
        </div>
      </div>
    );
  }


  // Если регистрация еще не успешна, отображаем форму регистрации
  return (
    <div className="form-container">
      <h1>Регистрация</h1>
      {/* Отображаем сообщение об ошибке, если есть */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Компоненты полей ввода */}
        <Input
          label="Email"
          id="register-email" // Уникальный ID для этого поля
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Поле обязательно для заполнения
        />

        <Input
          label="Пароль"
          id="register-password" // Уникальный ID
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8" // Минимальная длина пароля (согласно бэкенду и Pydantic)
        />

        <Input
          label="Повторите пароль"
          id="register-confirmPassword" // Уникальный ID
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength="8" // Минимальная длина (для совпадения с полем Пароль)
        />

        {/* Выбор роли (Используем стандартный select, стилизованный через form-input) */}
        <div className="form-group">
            <label htmlFor="register-role">Роль</label>
            <select
                id="register-role" // Уникальный ID
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input" // Применяем класс для стилизации Input
            >
                <option value="patient">Пациент</option>
                <option value="doctor">Врач</option>
                {/* Пока не даем регистрироваться как admin через фронтенд */}
                {/* <option value="admin">Администратор</option> */}
            </select>
        </div>

        {/* Группа для кнопки отправки формы */}
        <div className="button-group">
            <Button type="submit" variant="medical-blue" disabled={isLoading}>
              {/* Текст кнопки меняется в зависимости от состояния загрузки */}
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </div>
      </form>

       {/* Футер формы: ссылка для перехода на страницу входа */}
       <div className="form-footer">
           Уже есть аккаунт? <Button variant="link" onClick={() => navigate('/login')}>Войти</Button>
       </div>

    </div>
  );
}

export default RegisterPage; // Экспорт компонента по умолчанию