// frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';

// Импортируем компоненты MUI для формы
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography'; // Для ошибок
import Select from '@mui/material/Select';     // Для выпадающего списка роли
import MenuItem from '@mui/material/MenuItem';   // Пункты списка
import FormControl from '@mui/material/FormControl'; // Контейнер для Select с меткой
import InputLabel from '@mui/material/InputLabel'; // Метка для Select


// Компонент формы регистрации
// Принимает функцию onSubmit (которая будет вызывать регистрацию из стора),
// isLoading (статус загрузки из стора), и error (ошибка из стора)
function RegisterForm({ onSubmit, isLoading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient'); // По умолчанию 'patient'
  const [formError, setFormError] = useState(null); // Локальная ошибка валидации формы

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError(null);

    // Валидация на фронтенде
    if (password !== confirmPassword) {
       setFormError("Пароли не совпадают.");
       return;
    }
    // TODO: Добавить валидацию email, пароля по сложности

    // Вызываем функцию onSubmit, переданную из родительского компонента (AuthPage)
    onSubmit(email, password, role);
  };

  return (
     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
       {/* Поле ввода Email */}
       <TextField
         margin="normal"
         required
         fullWidth
         id="register-email"
         label="Email"
         name="email"
         autoComplete="email"
         autoFocus
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         type="email"
       />

       {/* Поле ввода Пароля */}
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

        {/* Поле ввода Повтора Пароля */}
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


        {/* Отображение локальной ошибки валидации формы */}
        {formError && (
           <Typography color="error" sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
             {formError}
           </Typography>
        )}

       {/* Кнопка отправки формы */}
       <Button
         type="submit"
         fullWidth
         variant="contained"
         sx={{ mt: 3, mb: 2 }}
         disabled={isLoading}
       >
         {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
       </Button>

        {/* TODO: Добавить ссылки типа "Уже есть аккаунт?" */}
     </Box>
  );
}

export default RegisterForm; // Экспорт компонента по умолчанию