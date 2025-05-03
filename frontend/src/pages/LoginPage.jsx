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

  // Состояние для UI (загрузка кнопки). Ошибка берется из стора.
  const [isLoading, setIsLoading] = useState(false); // Локальный флаг загрузки для кнопки

  // Получаем ошибку из стора для отображения в UI
  const loginError = useAuthStore((state) => state.error);

  const navigate = useNavigate(); // Хук для программной навигации

  // Получаем функцию логина и статус аутентификации из стора
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Эффект для перенаправления пользователя после успешного логина.
  // Зависит от isAuthenticated и navigate.
  useEffect(() => {
    // Если пользователь успешно авторизован (isAuthenticated стало true)
    if (isAuthenticated) {
      console.log("User authenticated, redirecting from login page.");
      // Перенаправляем на главную страницу или в личный кабинет после успешной аутентификации.
      // В будущем можно перенаправлять на /profile или /dashboard в зависимости от роли.
      navigate('/'); // TODO: Решить, куда перенаправлять после логина
    }
  }, [isAuthenticated, navigate]); // Зависимости: isAuthenticated и navigate


  // Если пользователь уже авторизован (и useEffect еще не перенаправил),
  // мы не отображаем форму логина. Возвращаем null, чтобы ничего не рендерилось на этой странице.
  if (isAuthenticated) {
      return null; // Можно отобразить сообщение "Вы уже вошли" или лоадер, если нужно.
  }


  // Обработчик отправки формы входа
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Базовая валидация на фронтенде
    // Ошибка валидации формы устанавливается напрямую в стор, используя его setState.
    if (!email || !password) {
        useAuthStore.setState({ error: "Пожалуйста, заполните все поля." }); // <--- ИСПРАВЛЕННЫЙ ВЫЗОВ
        return; // Прекращаем выполнение функции, если поля не заполнены
    }

    // Сбрасываем ошибку в сторе перед новой попыткой логина
    // Функция login в сторе уже делает это в начале, но можно явно сбросить и здесь:
    useAuthStore.setState({ error: null }); // Явный сброс ошибки перед отправкой


    setIsLoading(true); // Включаем индикатор загрузки на кнопке

    try {
      // Вызываем асинхронную функцию логина из стора
      // Ошибки при запросе к API обрабатываются внутри функции login стора
      // и выбрасываются как исключение, а также устанавливаются в состоянии 'error' стора.
      const user = await login(email, password);
      console.log('Login successful', user);
      // Перенаправление произойдет в useEffect, т.к. login обновит isAuthenticated в сторе

    } catch (err) {
      // Здесь перехватываются ошибки, выброшенные функцией login стора.
      // Сообщение об ошибке (например, "Email not confirmed...") уже установлено в состоянии 'error' стора.
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