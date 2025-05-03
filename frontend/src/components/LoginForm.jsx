// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // <-- Импортируем Box
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';


function LoginForm({ onSubmit, isLoading, error }) {
  const [email, setEmail] = useState(''); // Состояние для email
  const [password, setPassword] = useState(''); // Состояние для пароля
  const [formError, setFormError] = useState(null); // Локальная ошибка валидации формы (если нужна)


  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    setFormError(null); // Сбрасываем локальные ошибки формы

    // Базовая валидация на фронтенде
    if (!email || !password) {
       setFormError("Пожалуйста, заполните оба поля.");
       // TODO: Передать ошибку наверх или использовать общую ошибку из стора?
       // Сейчас ошибки API обрабатываются в сторе и доступны через пропс `error`.
       // Ошибки валидации формы можно обрабатывать локально, как здесь.
       return;
    }

    // Вызываем функцию onSubmit, переданную из родительского компонента (AuthPage).
    // Эта функция должна быть асинхронной и обрабатывать отправку данных на бэкенд и ошибки.
    // Не обрабатываем try/catch здесь, так как onSubmit должен этим заниматься.
    onSubmit(email, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
      {/* Поля ввода */}
      <TextField
        margin="normal"
        required
        fullWidth // <-- Уже настроено в теме по умолчанию
        id="login-email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />

      <TextField
        margin="normal"
        required
        fullWidth // <-- Уже настроено в теме по умолчанию
        name="password"
        label="Пароль"
        type="password"
        id="login-password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

       {/* Отображение локальной ошибки валидации формы */}
       {formError && (
          <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center', width: '100%' }}> {/* Добавлены mb: margin-bottom */}
            {formError}
          </Typography>
       )}

      {/* Кнопка отправки формы */}
      <Button
        type="submit"
        fullWidth // <-- Уже настроено в теме по умолчанию
        variant="contained" // Используем стиль с заливкой (primary color из темы)
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
      </Button>

      {/* Ссылка "Забыли пароль?" и "Еще нет аккаунта?" можно добавить здесь */}
      {/* Например, ссылка на страницу регистрации (AuthPage с активной вкладкой Регистрации) */}
      {/*
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
          <Link component="button" variant="body2" onClick={() => console.log('Forgot password')}>
              Забыли пароль?
          </Link>
      </Typography>
      */}
       {/* Кнопка для переключения на регистрацию (если это не отдельная страница) */}
       {/* Если это одна страница AuthPage, переключение идет через Tabs */}


    </Box>
  );
}

export default LoginForm;
