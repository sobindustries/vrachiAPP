// frontend/src/App.jsx
import React, { useEffect, useState } from 'react' // Импортируем useEffect и useState
// Импортируем компоненты для роутинга: Routes, Route, Link, useNavigate
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

// Импортируем компоненты страниц
import HomePage from './pages/HomePage' // Главная страница
import VerifyEmailPage from './pages/VerifyEmailPage' // Страница подтверждения Email
import ProfileSettingsPage from './pages/ProfileSettingsPage'; // <--- НОВОЕ ИМЯ Страницы настроек профиля
import NotFoundPage from './pages/NotFoundPage' // Страница 404 Not Found
import AuthPage from './pages/AuthPage'; // Страница для Входа и Регистрации

// Импортируем хук для доступа к стору аутентификации Zustand
import useAuthStore from './stores/authStore';
// Импортируем компонент для защиты роутов, требующих авторизации
import ProtectedRoute from './components/ProtectedRoute';

// Импортируем компоненты Material UI для использования в навигации и меню
import ButtonMUI from '@mui/material/Button'; // Используем псевдоним ButtonMUI
import Box from '@mui/material/Box'; // Box для удобства лейаута (например, в навигации)
import Menu from '@mui/material/Menu'; // Компонент выпадающего меню
import MenuItem from '@mui/material/MenuItem'; // Пункт меню
import TypographyMUI from '@mui/material/Typography'; // Текст из MUI типографики


// Импортируем основные стили (включая переменные и стили форм SASS)
import './index.scss';


// Главный компонент приложения, который настраивает роутинг и общую структуру
function App() {
  // Получаем из стора функцию инициализации, состояние аутентификации и загрузки, а также функцию логаута
  const initializeAuth = useAuthStore((state) => state.initializeAuth); // Функция для инициализации стора
  const { isAuthenticated, user, isLoading } = useAuthStore(); // Состояние: авторизован ли, его данные, статус загрузки
  const logout = useAuthStore((state) => state.logout); // Функция для выхода пользователя

  const navigate = useNavigate(); // Хук для программной навигации (для перенаправления после выхода)

  // Состояние для управления выпадающим меню пользователя
  const [anchorEl, setAnchorEl] = useState(null); // Привязка меню к элементу (null - закрыто)
  const isMenuOpen = Boolean(anchorEl); // Булево значение: открыто ли меню


  // Эффект для инициализации стора аутентификации при монтировании компонента App.
  // Запускается один раз при первой загрузке приложения.
  useEffect(() => {
    console.log("App mounted, initializing auth store...");
    initializeAuth(); // Вызываем функцию инициализации
  }, [initializeAuth]); // Зависимость ensure, что эффект запустится только один раз при монтировании.


  // --- Функции для управления меню пользователя ---

  // Открывает меню при клике на элемент с email/ролью
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Устанавливаем текущий элемент как якорь меню
  };

  // Закрывает меню
  const handleMenuClose = () => {
    setAnchorEl(null); // Сбрасываем якорь
  };

  // Переходит на страницу настроек профиля и закрывает меню
  const handleProfileSettingsClick = () => { // <--- НОВАЯ ФУНКЦИЯ ДЛЯ ПЕРЕХОДА
    handleMenuClose(); // Закрываем меню
    navigate('/profile'); // Переходим на страницу настроек профиля (мы переименовали ProfilePage в ProfileSettingsPage)
  };

   // Функция для обработки выхода (вызывается из меню)
  const handleLogout = () => {
      handleMenuClose(); // Закрываем меню перед выходом (опционально, но хорошо для UX)
      logout(); // Вызываем функцию логаута из стора
      navigate('/'); // <--- ПЕРЕНАПРАВЛЯЕМ на корневой роут после выхода. Корневой роут "/" отобразит AuthPage для неавторизованных.
  };


  // --- UI ---

  // Если идет загрузка инициализации стора
  if (isLoading) {
    // TODO: Заменить на красивый полноэкранный лоадер приложения
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Загрузка приложения...</Box>; // TODO: Заменить на полноэкранный спиннер или индикатор
  }


  // Основной UI приложения, который рендерится после завершения загрузки инициализации стора.
  return (
    // Корневой контейнер приложения с базовыми стилями SASS (.App из index.scss)
    <div className="App">
      {/* Основная навигация */}
      {/* Тег <nav> с flex-контейнером для размещения элементов в ряд и выравнивания */}
      <nav>
        {/* Список ссылок навигации */}
        <ul>
          {/* Ссылка на корневой маршрут "/" */}
          {/* Показываем ссылку только если не идет загрузка инициализации */}
           {!isLoading && (
             <li>
                {/* Текст ссылки зависит от статуса авторизации */}
                {/* Если авторизован, текст "Главная (Кабинет)". Если не авторизован, текст "Вход / Регистрация". */}
                {/* Ссылка всегда ведет на корень "/". То, какая страница отобразится по этому адресу, определяется роутингом ниже. */}
                <Link to="/">
                    {isAuthenticated ? 'Главная (Кабинет)' : 'Вход / Регистрация'}
                </Link>
             </li>
           )}

          {/* Ссылки Регистрации и Входа больше не нужны в этом списке навигации */}


          {/* Элементы для авторизованных пользователей */}
          {/* Отображаем этот блок только если пользователь авторизован */}
          {isAuthenticated && (
             <>
                {/* Элемент с email пользователя, который будет открывать выпадающее меню */}
                {/* Используем TypographyMUI для текста, стилизованного под кликабельный элемент */}
                <TypographyMUI
                  // Атрибуты для доступности (accessibility)
                  aria-controls={isMenuOpen ? 'user-menu' : undefined} // Связываем с меню по ID user-menu
                  aria-haspopup="true" // Указываем, что элемент открывает всплывающее меню
                  aria-expanded={isMenuOpen ? 'true' : undefined} // Статус меню (открыто/закрыто)

                  onClick={handleMenuOpen} // Обработчик клика для открытия меню
                  // Стилизация под кликабельный текст. cursor: 'pointer' меняет курсор.
                  // '&:hover': { textDecoration: 'underline' } добавляет подчеркивание при наведении.
                  sx={{ cursor: 'pointer', fontWeight: 'bold', color: '#333', '&:hover': { textDecoration: 'underline' } }}
                >
                   {/* Отображаем email и роль пользователя. Используем ?. для безопасного доступа, если user вдруг окажется null */}
                   {user?.email} ({user?.role})
                </TypographyMUI>

                 {/* Кнопка Выход как отдельный пункт в навигации - ТЕПЕРЬ ПЕРЕМЕЩЕНА В МЕНЮ */}
                 {/* УДАЛЯЕМ старую кнопку Выход из навигации */}
                 {/* <li>
                    <ButtonMUI variant="outlined" color="primary" onClick={handleLogout} size="small">
                        Выход
                    </ButtonMUI>
                 </li> */}

             </>
          )}
        </ul>

         {/* УДАЛЯЕМ старый спан с email, т.к. теперь используем TypographyMUI для кликабельного элемента */}
         {/* {isAuthenticated && user && (
             <span style={{marginLeft: 'auto', fontWeight: 'bold', color: '#333'}}>
                 {user.email} ({user.role})
             </span>
         )} */}
      </nav>

      {/* Компонент выпадающего меню пользователя */}
      {/* Отображается только если isMenuOpen === true */}
      <Menu
        anchorEl={anchorEl} // Привязываем меню к элементу, клик по которому его открыл
        id="user-menu" // Уникальный ID для меню
        open={isMenuOpen} // Состояние: открыто или закрыто
        onClose={handleMenuClose} // Обработчик закрытия меню (при клике вне меню или нажатии Esc)
        MenuListProps={{ // Пропсы для компонента списка элементов меню
          'aria-labelledby': 'user-email-element-id', // TODO: Связать с элементом email по aria-labelledby (нужно добавить id="user-email-element-id" к TypographyMUI выше)
        }}
      >
        {/* Элементы меню */}
        {/* При клике на пункт меню вызывается соответствующий обработчик и меню закрывается */}

        {/* Пункт "Настройки Профиля" */}
        <MenuItem onClick={handleProfileSettingsClick}>Настройки Профиля</MenuItem> {/* <--- НОВЫЙ ПУНКТ */}

        {/* TODO: Добавить другие пункты меню, если нужно (например, "Мой аккаунт", "История консультаций") */}
        {/* <MenuItem onClick={handleMyAccountClick}>Мой аккаунт</MenuItem> */}
        {/* <MenuItem onClick={handleHistoryClick}>История консультаций</MenuItem> */}

        {/* Разделитель между пунктами (опционально) */}
        {/* <Divider /> */}

        {/* Пункт "Выход" */}
        <MenuItem onClick={handleLogout}>Выход</MenuItem> {/* При клике вызывается handleLogout */}
      </Menu>


      {/* Определение набора маршрутов приложения с помощью компонента Routes */}
      <Routes>
        {/* Корневой роут "/" */}
        {/* Если пользователь авторизован (`isAuthenticated` === true), на "/" отображаем HomePage (главную/кабинет). */}
        {/* Если пользователь НЕ авторизован (`isAuthenticated` === false), на "/" отображаем AuthPage (страницу Входа/Регистрации). */}
        <Route path="/" element={isAuthenticated ? <HomePage /> : <AuthPage />} /> {/* <-- Условный рендеринг элемента */}


        {/* Роуты для /login и /register */}
        {/* Эти роуты ПРОСТО ОТОБРАЖАЮТ компонент AuthPage. Это нужно для корректной работы navigate('/login') и navigate('/register'). */}
        {/* Если пользователь авторизован и переходит на /login или /register, AuthPage увидит, что он авторизован, и перенаправит на корень ("/" -> HomePage). */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />


        {/* Страница подтверждения email */}
        {/* Эта страница должна быть доступна всегда, даже если пользователь не авторизован. */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />


        {/* Защищенные роуты (требуют авторизации) */}
        {/* Оборачиваем группу роутов, требующих авторизации, в компонент ProtectedRoute. */}
        {/* Компонент ProtectedRoute сам выполняет проверку isAuthenticated и опционально проверку роли (allowedRoles). */}
        {/* Нам больше не нужно условно рендерить <Route element={<ProtectedRoute />}> в App.jsx,
           т.к. сам ProtectedRoute выполняет перенаправление, если пользователь не авторизован.
           Удаляем условие {isAuthenticated && (...)} вокруг <Route element={<ProtectedRoute />}>.
           Это делает роуты более явными и позволяет ProtectedRoute обрабатывать неавторизованных пользователей.
        */}
        <Route element={<ProtectedRoute />}>
             {/* Роут для страницы настроек профиля */}
             {/* Этот роут защищен компонентом ProtectedRoute. Он требует только аутентификации (allowedRoles не указан). */}
             <Route path="/profile" element={<ProfileSettingsPage />} /> {/* <-- ИМЯ КОМПОНЕНТА ИЗМЕНЕНО */}
             {/* TODO: Добавить другие роуты, доступные всем авторизованным */}
             {/* Например: /search-doctors, /consultation/:id, /history и т.д. */}
        </Route>

         {/* Защищенные роуты с проверкой роли (пример: доступ к админке только для админов) */}
         {/* Этот роут защищен компонентом ProtectedRoute с проверкой роли 'admin'. */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        </Route>


        {/* Роут для просмотра публичного профиля врача по ID */}
        {/* Этот роут может быть ПУБЛИЧНЫМ. */}
        {/* <Route path="/doctors/:userId" element={<DoctorProfileViewPage />} /> */}


        {/* Роут для всех остальных путей - страница 404 Not Found */}
        {/* Этот роут с path="*" должен быть последним в списке <Routes>. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App // Экспорт основного компонента приложения по умолчанию