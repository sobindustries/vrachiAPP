// frontend/src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Хуки роутера: useNavigate для программной навигации, useLocation для получения информации о текущем URL
// Импортируем хук для доступа к стору аутентификации
import useAuthStore from '../stores/authStore';

// Импортируем компоненты форм ( LoginForm и RegisterForm )
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

// Импортируем компоненты Material UI для построения UI этой страницы
import Container from '@mui/material/Container'; // Контейнер для центрирования и ограничения ширины контента
import Box from '@mui/material/Box'; // Универсальный контейнер для лейаута и стилизации (аналог div с sx)
import Typography from '@mui/material/Typography'; // Для текстов и заголовков с типографикой из темы
import Tabs from '@mui/material/Tabs'; // Компонент для переключения между вкладками (Вход/Регистрация)
import Tab from '@mui/material/Tab'; // Отдельная вкладка
import Avatar from '@mui/material/Avatar'; // Для круглой иконки/аватарки
// Импортируем иконки из Material UI Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Иконка замочка (для входа)
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined'; // Иконка регистрации

// TODO: Возможно понадобится Grid для более сложного лейаута форм
// import Grid from '@mui/material/Grid';


// Страница для Входа и Регистрации пользователя. Отображается на маршрутах /login, /register и корневом / (для неавторизованных).
function AuthPage() {
  // Состояние для активной вкладки (0 - Вход, 1 - Регистрация)
  const [currentTab, setCurrentTab] = useState(0); // Изначально активна вкладка Входа (индекс 0)

  const navigate = useNavigate(); // Хук для программной навигации
  const location = useLocation(); // Хук для получения информации о текущем URL (путь, параметры и т.д.)

  // Получаем состояние и функции из стора аутентификации
  // isAuthLoading: статус загрузки инициализации стора при старте приложения
  // isAuthenticated: статус авторизации пользователя
  // authError: последняя ошибка, связанная с аутентификацией (логин, регистрация) из стора
  const { isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuthStore();
  // Получаем функции логина и регистрации из стора. Они будут переданы компонентам форм.
  const login = useAuthStore((state) => state.login);
  const registerUser = useAuthStore((state) => state.registerUser);
  // Получаем статус загрузки конкретного процесса (логин/регистрация) из стора.
  const isFormLoading = useAuthStore((state) => state.isLoading);


  // Эффект для перенаправления пользователя на главную страницу (или в личный кабинет) после успешной авторизации.
  // Запускается при изменении статуса isAuthenticated или isLoading.
  useEffect(() => {
    // Если инициализация стора завершена (!isAuthLoading) И пользователь авторизован (isAuthenticated)
    if (!isAuthLoading && isAuthenticated) {
       console.log("AuthPage: User authenticated, redirecting to home.");
       // Выполняем перенаправление
       navigate('/'); // TODO: Определить конечный маршрут после логина (например, /profile или главная)
    }
     // TODO: Если isLoading (общая загрузка приложения), можно показать глобальный лоадер ЗДЕСЬ, в AuthPage,
     // если компонент отображается, пока isLoading === true. Но лучше это делать выше, в App.jsx.
     // if (isAuthLoading) return; // Если isLoading true, просто ничего не делаем или показываем лоадер
  }, [isAuthenticated, isAuthLoading, navigate]); // Зависимости эффекта

  // Эффект для установки активной вкладки (Вход или Регистрация) в зависимости от текущего URL.
  // Запускается при изменении пути URL (например, при прямом заходе на /login или /register).
  useEffect(() => {
     // Проверяем текущий путь (pathname)
     if (location.pathname === '/register') {
         setCurrentTab(1); // Если путь /register, активируем вкладку Регистрации (индекс 1)
     } else { // Если путь /login или любой другой путь (например, / когда не авторизован)
         setCurrentTab(0); // Активируем вкладку Входа (индекс 0) по умолчанию.
     }
     // Сбрасываем сообщение об ошибке в сторе при смене URL (и, следовательно, при смене вкладки).
     // Это нужно, чтобы ошибка логина не отображалась на вкладке регистрации и наоборот.
     useAuthStore.setState({ error: null }); // Сбрасываем ошибку напрямую в сторе
  }, [location.pathname]); // Зависимость: эффект запускается при изменении пути URL (location.pathname)


  // Обработчик смены вкладки (при клике на вкладку)
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue); // Устанавливаем новую активную вкладку
    // При смене вкладки также программно меняем URL, чтобы это отразилось в адресной строке
    // и при обновлении страницы оставалась активной нужная вкладка.
    if (newValue === 0) { // Если переключились на Вход
        navigate('/login', { replace: true }); // Перенаправляем на /login, заменяя текущую запись в истории
    } else { // Если переключились на Регистрацию
        navigate('/register', { replace: true }); // Перенаправляем на /register, заменяя текущую запись в истории
    }
  };

  // Если пользователь в процессе инициализации стора (проверка токена при старте)
  // Отображаем индикатор загрузки и не рендерим остальной UI страницы AuthPage.
  if (isAuthLoading) {
       return <div>Загрузка авторизации...</div>; // TODO: Глобальный лоадер
  }

  // Если пользователь уже авторизован (инициализация завершена и isAuthenticated стало true)
  // Эта страница не должна отображаться, так как пользователь уже вошел.
  // useEffect выше должен перенаправить его. Возвращаем null, чтобы избежать мерцания формы.
  if (isAuthenticated) {
       return null; // Или <Navigate to="/" replace />;
  }


  // Основной UI страницы AuthPage
  return (
    // Container из MUI для центрирования и ограничения ширины контента (max-width="sm" - ~600px на больших экранах)
    // component="main" для семантического значения
    <Container component="main" maxWidth="sm">
      {/* Box из MUI как контейнер для содержимого страницы (формы, иконка, заголовок, вкладки) */}
      <Box
        sx={{ // sx - пропс для стилизации с использованием темы MUI (spacing unit, palette colors, shadow values и т.д.)
          marginTop: 8, // Отступ сверху (8 * theme.spacing)
          display: 'flex', // Flex-контейнер
          flexDirection: 'column', // Элементы располагаются вертикально
          alignItems: 'center', // Элементы выравниваются по центру по горизонтали
          padding: 4, // Внутренний отступ со всех сторон (4 * theme.spacing)
          backgroundColor: 'white', // Белый фон контейнера
          borderRadius: 1, // Скругление углов (1 * theme.shape.borderRadius)
          boxShadow: 3, // Тень (из палитры теней темы)
        }}
      >
        {/* Иконка в круглой аватарке. Цвет фона primary.main из темы. */}
        {/* Иконка меняется в зависимости от активной вкладки (Вход или Регистрация). */}
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> {/* m: margin */}
            {currentTab === 0 ? <LockOutlinedIcon /> : <AppRegistrationOutlinedIcon />}
        </Avatar>

        {/* Заголовок страницы. Используем типографику h5 из темы MUI. */}
        {/* Текст заголовка меняется в зависимости от активной вкладки. */}
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}> {/* mb: margin-bottom */}
           {currentTab === 0 ? 'Вход' : 'Регистрация'}
        </Typography>

        {/* Компонент Tabs для переключения между формами */}
        {/* value - текущая активная вкладка, onChange - обработчик смены вкладки, centered - центрирование вкладок */}
         <Tabs value={currentTab} onChange={handleTabChange} centered>
             {/* Отдельная вкладка для Входа */}
             <Tab label="Вход" />
             {/* Отдельная вкладка для Регистрации */}
             <Tab label="Регистрация" />
         </Tabs>

         {/* Контейнер для отображения форм Логина или Регистрации */}
         {/* Устанавливаем ширину 100% и отступ сверху */}
         <Box sx={{ width: '100%', mt: 3 }}> {/* mt: margin-top */}

            {/* Отображение сообщения об ошибке из стора */}
            {/* Ошибка может появиться после неудачной попытки логина или регистрации. */}
            {authError && (
               <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}> {/* mb: margin-bottom */}
                 {authError} {/* Текст ошибки */}
               </Typography>
            )}

            {/* Условное отображение формы в зависимости от активной вкладки (currentTab) */}
            {currentTab === 0 && (
                // Если активна вкладка Входа, рендерим компонент LoginForm.
                // Передаем в него функцию handleSubmit (которая вызывает login из стора),
                // статус загрузки (isFormLoading), и ошибку (authError) для отображения.
                <LoginForm onSubmit={login} isLoading={isFormLoading} error={authError} />
            )}
            {currentTab === 1 && (
                // Если активна вкладка Регистрации, рендерим компонент RegisterForm.
                // Передаем в него функцию handleSubmit (которая вызывает registerUser из стора),
                // статус загрузки (isFormLoading), и ошибку (authError) для отображения.
                <RegisterForm onSubmit={registerUser} isLoading={isFormLoading} error={authError} />
            )}
         </Box>


      </Box>
    </Container>
  );
}

export default AuthPage; // Экспорт компонента по умолчанию