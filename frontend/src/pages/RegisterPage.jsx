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
  // Ошибка теперь берется из стора для отображения в UI в AuthPage
  // const [error, setError] = useState(null); // Удаляем локальное состояние ошибки
  const [isLoading, setIsLoading] = useState(false); // Флаг загрузки для кнопки
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Флаг успешной регистрации


  const navigate = useNavigate(); // Хук для программной навигации

  // Получаем функцию регистрации пользователя из стора
  const registerUser = useAuthStore((state) => state.registerUser);
   // Получаем ошибку из стора для отображения (отображается в AuthPage)
  const authError = useAuthStore((state) => state.error);


  // Обработчик отправки формы регистрации
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы браузером

    // Сбрасываем ошибку в сторе перед новой попыткой регистрации
    useAuthStore.setState({ error: null }); // Устанавливаем error в null напрямую через setState стора


    // Базовая валидация на фронтенде: проверка совпадения паролей
    if (password !== confirmPassword) {
      // Устанавливаем ошибку валидации формы напрямую в стор
       useAuthStore.setState({ error: "Пароли не совпадают." });
      return; // Прерываем выполнение функции
    }
    // TODO: Добавить более строгую валидацию email (например, через regex или библиотеку)
    // TODO: Добавить валидацию сложности пароля, если требуется


    setIsLoading(true); // Включаем индикатор загрузки на кнопке

    try {
      // Вызываем функцию регистрации пользователя из стора
      // Эта функция асинхронна и возвращает промис. Ошибки обрабатываются в сторе.
      const newUser = await registerUser(email, password, role);

      console.log('Registration successful', newUser);

      // Если регистрация прошла успешно, устанавливаем флаг успеха
      setRegistrationSuccess(true);

      // Очищаем поля формы после успешной регистрации (опционально)
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('patient'); // Сбрасываем роль на дефолтную


      // Опционально: автоматически перенаправить пользователя после успешной регистрации (например, на страницу входа)
      // setTimeout(() => {
      //   navigate('/login');
      // }, 5000); // Перенаправить через 5 секунд


    } catch (err) {
      // Ошибки из стора (например, ошибка с бэкенда) будут выброшены здесь.
      // Сообщение об ошибке уже установлено в состоянии стора (useAuthStore.getState().error).
      console.error('Registration failed in component', err);
      // Нет необходимости снова устанавливать ошибку здесь, она уже установлена в сторе и отобразится в AuthPage.
    } finally {
      // Этот блок выполняется в любом случае после try или catch
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };


  // Если регистрация успешно завершена, отображаем сообщение об успехе вместо формы
  if (registrationSuccess) {
    return (
      // Используем класс form-container для центрирования и стилизации (определен в styles/_forms.scss)
      <div className="form-container">
        <h1>Регистрация</h1>
        <div style={{ textAlign: 'center' }}> {/* Центрируем текст внутри контейнера */}
            <p className="success-message"> {/* Используем класс для сообщений об успехе */}
                Вы успешно зарегистрированы!
            </p>
             <p style={{ marginBottom: '20px' }}> {/* Отступ снизу */}
                На вашу почту отправлена ссылка для подтверждения Email.
                Пожалуйста, перейдите по ней, чтобы активировать ваш аккаунт.
                <br/> {/* Добавляем перенос строки */}
                {/* Явное указание, куда смотреть в режиме разработки (пока нет реальной отправки писем) */}
                В режиме разработки ссылка для подтверждения выведена в <strong>консоль сервера бэкенда</strong>.
             </p>
            {/* Кнопка для перехода на страницу входа */}
            <Button variant="medical-blue" onClick={() => navigate('/login')}>Перейти на страницу входа</Button>
        </div>
      </div>
    );
  }


  // Если регистрация еще не успешна, отображаем форму регистрации
  // Ошибка отображается выше, в AuthPage.
  return (
    // Используем класс form-container для центрирования и стилизации (определен в styles/_forms.scss)
    // H1 и сообщение об ошибке теперь в AuthPage.
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}> {/* Используем Box из MUI для формы */}
       {/* Заголовок h1 и сообщение об ошибке errorMsg теперь в AuthPage */}
       {/* {error && <p className="error-message">{error}</p>} */}

        {/* Компоненты полей ввода MUI */}
        <TextField
            margin="normal" // Стандартный отступ сверху/снизу
            required // Делаем поле обязательным (MUI добавит индикатор)
            fullWidth // Растягиваем на всю ширину
            id="register-email"
            label="Email"
            name="email"
            autoComplete="email" // Подсказки автозаполнения браузера
            autoFocus // Автофокус при загрузке страницы
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" // Тип email для браузера
         />

        {/* Поле ввода Пароля MUI */}
        <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="register-password"
            autoComplete="new-password" // Подсказки автозаполнения
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

         {/* Поле ввода Повтора Пароля MUI */}
        <TextField
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Повторите пароль"
            type="password"
            id="register-confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Выбор Роли (используем FormControl и Select из MUI) */}
        <FormControl margin="normal" fullWidth>
            <InputLabel id="register-role-label">Роль</InputLabel>
            <Select
              labelId="register-role-label"
              id="register-role"
              value={role}
              label="Роль" // Должен совпадать с текстом InputLabel при variant="outlined" или "filled"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="patient">Пациент</MenuItem>
              <MenuItem value="doctor">Врач</MenuItem>
              {/* <MenuItem value="admin">Администратор</MenuItem> */}
            </Select>
        </FormControl>


        {/* Группа для кнопки отправки формы */}
        {/* Используем Box из MUI для лейаута кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}> {/* Центрируем кнопку и добавляем отступ сверху */}
            <ButtonMUI type="submit" variant="contained" color="primary" disabled={isLoading}> {/* Используем ButtonMUI */}
              {/* Текст кнопки меняется в зависимости от состояния загрузки */}
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'} {/* Индикатор загрузки MUI */}
            </ButtonMUI>
        </Box>

         {/* Ссылка для перехода на страницу входа (теперь она в AuthPage) */}
         {/* <div className="form-footer">
            Уже есть аккаунт? <Button variant="link" onClick={() => navigate('/login')}>Войти</Button>
         </div> */}

      </Box>
  );
}

export default RegisterPage; // Экспорт компонента по умолчанию