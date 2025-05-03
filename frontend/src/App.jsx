// src/App.jsx
import React, { useEffect } from 'react' // Импортируем useEffect
import { Routes, Route, Link } from 'react-router-dom'

// Импортируем компоненты страниц
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Импортируем стор аутентификации и компонент для защиты роутов
import useAuthStore from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth); // Получаем функцию инициализации из стора
  const { isAuthenticated, user, isLoading } = useAuthStore(); // Получаем состояние

  // Вызываем инициализацию стора при монтировании компонента App
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]); // Зависимость initializeAuth гарантирует, что эффект запустится только один раз


  // Если isLoading, можно показать глобальный лоадер или null
  // if (isLoading) {
  //   return <div>Загрузка приложения...</div>; // Или null, или спиннер
  // }


  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Главная</Link></li>
          {!isAuthenticated && ( // Показываем ссылки только если не авторизован
             <>
                <li><Link to="/register">Регистрация</Link></li>
                <li><Link to="/login">Вход</Link></li>
             </>
          )}
          {isAuthenticated && ( // Показываем ссылки только если авторизован
             <>
                <li><Link to="/profile">Профиль</Link></li>
                {/* Логаут будет в другом месте или как отдельная кнопка */}
             </>
          )}
        </ul>
      </nav>

      {/* Определение роутов */}
      <Routes>
        {/* Публичные роуты */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Защищенные роуты */}
        {/* Оборачиваем защищенные роуты в компонент ProtectedRoute */}
        <Route element={<ProtectedRoute />}> {/* По умолчанию требует просто авторизации */}
             <Route path="/profile" element={<ProfilePage />} />
             {/* TODO: Добавить другие защищенные роуты здесь */}
             {/* <Route path="/search-doctors" element={<SearchPage />} /> */}
             {/* <Route path="/consultation/:id" element={<ConsultationPage />} /> */}
        </Route>

         {/* Защищенные роуты с проверкой роли (пример) */}
        {/* <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
             <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
             <Route path="/patient/history" element={<PatientHistory />} />
        </Route> */}


        {/* Роут для всех остальных путей (страница 404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App