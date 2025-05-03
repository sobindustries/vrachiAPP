// frontend/src/pages/ProfileSettingsPage.jsx
import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Для перенаправления (если нужно)
import api from '../api'; // Импортируем наш API сервис
import useAuthStore from '../stores/authStore'; // Импортируем стор для получения данных пользователя

// Импортируем компоненты форм для Пациента и Врача
import PatientProfileForm from '../components/PatientProfileForm'; // <--- ИМПОРТИРУЕМ
import DoctorProfileForm from '../components/DoctorProfileForm'; // <--- ИМПОРТИРУЕМ


// Импортируем компоненты Material UI для построения UI этой страницы
import Container from '@mui/material/Container'; // Контейнер
import Box from '@mui/material/Box'; // Универсальный контейнер
import Typography from '@mui/material/Typography'; // Текст и заголовки
import CircularProgress from '@mui/material/CircularProgress'; // Индикатор загрузки
// TODO: Возможно понадобится Paper или Card для стилизации контейнера профиля
// import Paper from '@mui/material/Paper';


// Страница для просмотра и редактирования настроек профиля пользователя (Пациента или Врача)
// Отображается по маршруту /profile (защищен ProtectedRoute)
function ProfileSettingsPage() {
  // Состояние для данных профиля (загруженных с бэкенда)
  // Может хранить либо PatientProfileResponse, либо DoctorProfileResponse, либо null.
  const [profileData, setProfileData] = useState(null);

  // Состояния для UI: статус загрузки данных профиля при открытии страницы
  const [isLoading, setIsLoading] = useState(true);

  // Состояния для UI: ошибки (загрузки или сохранения) и флаг успешного сохранения
  const [error, setError] = useState(null); // Сообщение об ошибке (загрузки или сохранения)
  const [saveSuccess, setSaveSuccess] = useState(false); // Флаг успешного сохранения (для сообщения)
  const [isSaving, setIsSaving] = useState(false); // Флаг процесса сохранения (для индикатора на кнопке формы)


  // Получаем данные текущего пользователя (включая роль) из стора аутентификации
  const { user, isAuthenticated } = useAuthStore();
  // const setUser = useAuthStore((state) => state.setUser); // Функция для обновления пользователя в сторе (если понадобится)


  // --- Логика загрузки профиля ---
  // Эффект выполняется при монтировании компонента и при изменении user.id/isAuthenticated
  useEffect(() => {
    // Проверяем, что пользователь авторизован и объект user доступен.
    // ProtectedRoute уже должен был это проверить, но на всякий случай.
    if (!isAuthenticated || !user) {
         setIsLoading(false);
         setError("Пользователь не авторизован."); // Это сообщение, вероятно, никогда не будет видно из-за ProtectedRoute
         return;
     }

    // Асинхронная функция для загрузки данных профиля с бэкенда
    const fetchProfile = async () => {
       setIsLoading(true); // Начинаем загрузку
       setError(null); // Сбрасываем предыдущие ошибки (загрузки или сохранения)
       setSaveSuccess(false); // Сбрасываем флаг успешного сохранения при новой загрузке

      try {
        // Отправляем GET запрос на эндпоинт бэкенда для получения профиля текущего пользователя.
        // API сервис (axios) автоматически добавляет JWT токен из Local Storage в заголовок Authorization.
        const response = await api.get('/users/me/profile');

        // Сохраняем полученные данные профиля в состояние компонента
        setProfileData(response.data);
        console.log('Profile data loaded:', response.data);

      } catch (err) {
        // Обработка ошибок при загрузке профиля (например, 404 Not Found, если профиль еще не создан)
        console.error('Failed to load profile:', err);
        // Устанавливаем соответствующее сообщение об ошибке загрузки
        // Обрабатываем специфический статус 404 (профиль не найден)
        if (err.response && err.response.status === 404) {
            setError("Профиль еще не создан. Пожалуйста, заполните информацию."); // Специальное сообщение для 404
            setProfileData(null); // Убеждаемся, что profileData null, если профиль не найден
        } else {
            setError("Ошибка при загрузке профиля. Попробуйте позже."); // Общее сообщение для других ошибок
            setProfileData(null);
        }

      } finally {
        setIsLoading(false); // Завершаем загрузку в любом случае
      }
    };

    // Вызываем асинхронную функцию загрузки профиля
    fetchProfile();

    // Зависимости: эффект запускается при монтировании и при изменении user?.id или isAuthenticated.
  }, [user?.id, isAuthenticated]); // Используем user?.id для безопасного доступа


  // --- Логика сохранения профиля (общая для Пациента и Врача) ---
  // Эта функция будет передана дочерним компонентам форм (PatientProfileForm/DoctorProfileForm)
  // и вызвана ими при отправке формы.
  const handleSaveProfile = async (profileDataFromForm) => {
     setIsSaving(true); // Включаем индикатор сохранения на кнопке формы
     setError(null); // Сбрасываем предыдущие ошибки сохранения
     setSaveSuccess(false); // Сбрасываем предыдущий статус успеха

     // Проверяем, что пользователь авторизован и его роль определена
     if (!user || !(user.role === 'patient' || user.role === 'doctor')) {
         console.error("Attempted to save profile for user with invalid role or not authenticated.");
         setError("Невозможно сохранить профиль. Неверная роль пользователя.");
         setIsSaving(false);
         return;
     }

     // Определяем эндпоинт для сохранения в зависимости от роли пользователя
     // user.role доступен из стора
     const endpoint = user.role === 'patient' ? '/patients/profiles' : '/doctors/profiles';

     try {
        // Отправляем POST запрос на соответствующий эндпоинт с данными формы
        // API сервис (axios) автоматически добавит JWT токен.
        const response = await api.post(endpoint, profileDataFromForm);

        // Если сохранение успешно (бэкенд вернул 201 Created или 200 OK)
        console.log('Profile saved successfully:', response.data);
        setProfileData(response.data); // Обновляем данные профиля в состоянии компонента с актуальными данными от бэкенда
        setSaveSuccess(true); // Устанавливаем флаг успешного сохранения

        // TODO: Если нужно обновить данные пользователя (например, ФИО), которые могут быть в UserResponse,
        // можно вызвать setUser из стора и передать ему только UserResponse данные, если они приходят в ответ на сохранение профиля.
        // setUser(response.data); // Это обновит только поля из UserResponse, не из профиля

        // Опционально: Сбросить флаг успешного сохранения через несколько секунд
        // setTimeout(() => setSaveSuccess(false), 5000);

     } catch (err) {
        // Обработка ошибок сохранения (например, ошибка валидации на бэкенде, ошибка БД)
        console.error('Failed to save profile:', err);
         const errorMessage = err.response?.data?.detail || "Ошибка при сохранении профиля. Попробуйте еще раз.";
        setError(errorMessage); // Устанавливаем сообщение об ошибке сохранения (будет отображено в UI ProfileSettingsPage)

     } finally {
        setIsSaving(false); // Завершаем сохранение в любом случае
     }
  };


  // --- Отображение UI страницы настроек профиля ---

  // Если идет загрузка данных профиля
  if (isLoading) {
    return (
        // Используем контейнер MUI Box для лейаута загрузки
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}> {/* minHeight для центрирования на части экрана */}
            <CircularProgress /> {/* Индикатор загрузки MUI */}
            <Typography variant="h6" sx={{ ml: 2 }}>Загрузка Профиля...</Typography> {/* Сообщение рядом с лоадером */}
        </Box>
    );
  }

  // Если произошла ошибка загрузки, кроме "Профиль еще не создан"
  // Сообщение "Профиль еще не создан" обрабатывается ниже, отображением формы.
  if (error && error !== "Профиль еще не создан. Пожалуйста, заполните информацию.") {
       return (
         // Используем контейнер MUI Box для отображения ошибки
         <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error">Ошибка загрузки профиля</Typography> {/* Заголовок ошибки */}
            <Typography color="error" sx={{ mt: 2 }}>{error}</Typography> {/* Текст ошибки */}
         </Box>
       );
   }

   // Если пользователь не авторизован или нет данных пользователя (хотя ProtectedRoute должен это предотвратить)
   // Этот случай, вероятно, никогда не возникнет благодаря ProtectedRoute и проверке isLoading.
   if (!user) {
        // Можно перенаправить на логин, но ProtectedRoute уже должен это сделать.
        return null; // Ничего не отображаем.
   }


  // Основной UI страницы настроек профиля (после успешной загрузки или если профиль не создан)
  return (
    // Используем контейнер MUI Container для центрирования формы
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}> {/* maxWidth md для немного большей ширины */}
      {/* Box для содержимого страницы */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Центрирование по горизонтали
          padding: 4, // Внутренний отступ
          backgroundColor: 'white', // Белый фон
          borderRadius: 1, // Скругление углов
          boxShadow: 3, // Тень
        }}
      >
        {/* Заголовок страницы */}
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Настройки Профиля
        </Typography>

        {/* Сообщения о статусе загрузки или сохранения */}
         {/* Сообщение "Профиль еще не создан" */}
         {profileData === null && error === "Профиль еще не создан. Пожалуйста, заполните информацию." && (
             <Typography variant="body1" color="info" sx={{textAlign: 'center', marginBottom: 2}}> {/* Используем Typography с цветом 'info' из темы */}
                 Ваш профиль еще не создан. Пожалуйста, заполните информацию ниже.
             </Typography>
         )}
         {/* Сообщение об успешном сохранении */}
         {profileData && saveSuccess && (
              <Typography variant="body1" color="success" sx={{textAlign: 'center', marginBottom: 2}}>
                  Профиль успешно сохранен!
              </Typography>
         )}
          {/* Сообщение об ошибке сохранения */}
          {error && error !== "Профиль еще не создан. Пожалуйста, заполните информацию." && (
               <Typography variant="body1" color="error" sx={{textAlign: 'center', marginBottom: 2}}>
                    {error} {/* Текст ошибки сохранения */}
               </Typography>
          )}


        {/* Отображаем соответствующую форму профиля в зависимости от роли пользователя */}
        {/* Передаем текущие данные profileData и функцию handleSaveProfile */}
        {/* user.role доступен из стора */}
        {user.role === 'patient' && (
             // Рендерим компонент формы профиля Пациента
             <PatientProfileForm
                 profile={profileData} // Передаем текущие данные профиля (будут null, если профиль не создан)
                 onSave={handleSaveProfile} // Передаем функцию сохранения
                 isLoading={isSaving} // Переименовал, чтобы было понятнее - это статус сохранения
                 error={error} // Ошибка сохранения
             />
        )}

        {user.role === 'doctor' && (
             // Рендерим компонент формы профиля Врача
             <DoctorProfileForm
                 profile={profileData} // Передаем текущие данные профиля
                 onSave={handleSaveProfile} // Передаем функцию сохранения
                 isLoading={isSaving} // Статус сохранения
                 error={error} // Ошибка сохранения
             />
        )}

        {/* Если пользователь авторизован, но его роль не 'patient' и не 'doctor' (например, admin) */}
        {/* Для администратора, возможно, будет свой отдельный раздел */}
        {user.role !== 'patient' && user.role !== 'doctor' && (
            <Typography variant="body1" sx={{textAlign: 'center'}}>
                Для вашей роли профиль не предусмотрен в этом разделе.
            </Typography>
        )}

      </Box>
    </Container>
  );
}

// Экспорт компонента по умолчанию
export default ProfileSettingsPage;