// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Для перенаправления
import Input from '../components/Input'; // Импортируем компонент Input
import Button from '../components/Button'; // Импортируем компонент Button
import useAuthStore from '../stores/authStore'; // Импортируем стор аутентификации


function LoginPage() {
  // Состояния для полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Состояния для UI (ошибки, загрузка)
  const [isLoading, setIsLoading] = useState(false); // Локальный флаг загрузки для кнопки
  // Ошибка теперь берется из стора для отображения в UI
  const loginError = useAuthStore((state) => state.error); // Получаем ошибку из стора


  const navigate = useNavigate(); // Хук для программной навигации

  // Получаем функцию логина и статус аутентификации из стора
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Эффект для перенаправления пользователя после успешного логина.
  // Зависит от isAuthenticated и navigate.
  useEffect(() => {
    if (isAuthenticated) {
      // Перенаправляем на главную страницу или в личный кабинет после успешной аутентификации.
      // В будущем можно перенаправлять на /profile или /dashboard в зависимости от роли.
      navigate('/'); // TODO: Решить, куда перенаправлять после логина
    }
  }, [isAuthenticated, navigate]); // Зависимости: эффект срабатывает при изменении этих значений

  // Если пользователь уже авторизован (и useEffect еще не перенаправил),
  // мы не отображаем форму логина.
  if (isAuthenticated) {
      return null; // Можно отобразить сообщение "Вы уже вошли" или лоадер, если нужно.
  }


  // Обработчик отправки формы входа
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Сбрасываем ошибку в сторе перед новой попыткой логина
    useAuthStore.setState({ error: null }); // Устанавливаем error в null напрямую через setState стора

    // Базовая валидация на фронтенде
    if (!email || !password) {
        useAuthStore.setState({ error: "Пожалуйста, заполните все поля." }); // Устанавливаем ошибку в сторе
        return;
    }

    setIsLoading(true); // Включаем индикатор загрузки на кнопке

    try {
      // Вызываем асинхронную функцию логина из стора
      const user = await login(email, password);
      console.log('Login successful', user);
      // Перенаправление произойдет в useEffect, т.к. login обновит isAuthenticated в сторе

    } catch (err) {
      // Ошибки при логине (например, неверные данные, email не подтвержден)
      // Обработка ошибок (установка errorMessage в состояние 'error' стора) уже происходит внутри функции login стора.
      // Здесь, в компоненте, мы можем просто перехватить выброшенное исключение, если нужно,
      // но сообщение об ошибке уже будет доступно через loginError (из стора) для отображения в UI.
      console.error('Login failed in component', err);
      // Нет необходимости снова устанавливать ошибку здесь, она уже установлена в сторе.
    } finally {
      // Этот блок выполняется в любом случае после try или catch
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };


  return (
    <div className="form-container">
      <h1>Вход (Авторизация)</h1>
      {/* Отображаем сообщение об ошибке, если оно есть в сторе */}
      {loginError && <p className="error-message">{loginError}</p>}

      <form onSubmit={handleSubmit}>
        {/* Компоненты полей ввода */}
        <Input
          label="Email"
          id="login-email" // Уникальный ID для этого поля
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Поле обязательно для заполнения
        />

        <Input
          label="Пароль"
          id="login-password" // Уникальный ID
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Группа для кнопки отправки формы */}
        <div className="button-group">
            <Button type="submit" variant="medical-blue" disabled={isLoading}>
              {/* Текст кнопки меняется в зависимости от состояния загрузки */}
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
        </div>
      </form>

       {/* Футер формы: ссылка для перехода на страницу регистрации */}
       <div className="form-footer">
          Ещё нет аккаунта? <Button variant="link" onClick={() => navigate('/register')}>Зарегистрироваться</Button>
       </div>

    </div>
  );
}

export default LoginPage; // Экспорт компонента по умолчанию