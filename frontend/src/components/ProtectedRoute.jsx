// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet для вложенных роутов, Navigate для перенаправления
import useAuthStore from '../stores/authStore'; // Импортируем наш стор аутентификации

// Компонент для защиты роутов.
// Если пользователь не аутентифицирован или не имеет нужной роли, перенаправляет или показывает ошибку.
// Используется для оборачивания <Route> элементов в компоненте <Routes>.
function ProtectedRoute({ allowedRoles }) {
  // Получаем состояние аутентификации из стора
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Пока идет проверка аутентификации при старте приложения (загрузка из Local Storage и валидация токена на бэкенде)
  // В это время мы еще не знаем точно, авторизован пользователь или нет.
  // Показываем индикатор загрузки или null.
  if (isLoading) {
    // TODO: Заменить на красивый полноэкранный лоадер приложения
    return <div>Загрузка приложения...</div>; // Или null, чтобы ничего не показывалось до определения статуса
  }

  // После завершения загрузки:
  // Если пользователь не аутентифицирован
  if (!isAuthenticated) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    // Перенаправляем на страницу логина.
    // 'replace' заменяет текущую запись в истории браузера, чтобы пользователь не мог вернуться на защищенную страницу кнопкой "Назад".
    return <Navigate to="/login" replace />;
  }

  // Если пользователь аутентирован, но для данного роута требуются определенные роли
  // allowedRoles - это массив строк, например ['doctor', 'admin']
  if (allowedRoles && allowedRoles.length > 0) {
    // Проверяем, существует ли объект пользователя (он должен быть, если isAuthenticated true)
    // и входит ли его роль в массив разрешенных ролей allowedRoles.
    if (!user || !allowedRoles.includes(user.role)) {
        console.log(`ProtectedRoute: User role '${user?.role}' not in allowed roles: ${allowedRoles.join(', ')}`);
        // Если роль не соответствует, показываем сообщение об ошибке доступа (403 Forbidden)
        // TODO: Заменить на отдельную страницу ошибки 403 "Доступ запрещен"
        return <div>Доступ запрещен (403 Forbidden)</div>;
    }
     console.log(`ProtectedRoute: User role '${user?.role}' allowed.`);
  }

  // Если пользователь аутентифицирован и соответствует всем требованиям к роли (если они были указаны),
  // рендерим содержимое дочернего роута (с помощью компонента <Outlet /> из react-router-dom).
  // <Outlet /> используется, когда ProtectedRoute оборачивает группу вложенных <Route> в родительском компоненте (например, App.jsx).
   console.log("ProtectedRoute: Access granted, rendering content.");
  return <Outlet />;
}

export default ProtectedRoute; // Экспорт компонента по умолчанию