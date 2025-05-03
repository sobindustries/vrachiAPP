// frontend/src/components/PatientProfileForm.jsx
import React, { useState, useEffect } from 'react';

// Импортируем компоненты Material UI
import TextField from '@mui/material/TextField'; // Поле ввода текста
import Button from '@mui/material/Button';     // Кнопка
import Box from '@mui/material/Box';           // Универсальный контейнер для лейаута
import Typography from '@mui/material/Typography'; // Текст и заголовки
import CircularProgress from '@mui/material/CircularProgress'; // Индикатор загрузки
// import FormControlLabel from '@mui/material/FormControlLabel'; // Для чекбозов, радиокнопок
// import Checkbox from '@mui/material/Checkbox'; // Чекбокс


// Компонент формы для профиля Пациента
// Используется на странице ProfileSettingsPage для создания или редактирования профиля Пациента.
// Принимает:
// - profile: Объект с текущими данными профиля пациента (null, если профиль не создан).
// - onSave: Функция, которая будет вызвана при отправке формы с данными профиля.
// - isLoading: Флаг, указывающий, идет ли процесс сохранения (передается из родительского компонента).
// - error: Сообщение об ошибке сохранения (передается из родительского компонента).
function PatientProfileForm({ profile, onSave, isLoading, error }) { // Переименовал isLoading/error для ясности в props
   // Состояния формы, предзаполненные данными из пропса profile (если он есть)
   // Используем пустые строки как начальное значение, чтобы избежать null в полях ввода.
   const [full_name, setFullName] = useState('');
   const [contact_phone, setContactPhone] = useState('');
   const [contact_address, setContactAddress] = useState('');

   // Локальное состояние для ошибки валидации формы на фронтенде (например, если поле обязательное, а оно пустое).
   // Ошибки сохранения с бэкенда обрабатываются в родительском компоненте (ProfileSettingsPage).
   const [formLocalError, setFormLocalError] = useState(null);


   // Эффект для предзаполнения формы при получении данных профиля из пропсов.
   // Запускается при изменении пропса profile (например, когда данные профиля загружены).
   useEffect(() => {
      if (profile) {
         // Если объект profile не null (профиль загружен), предзаполняем состояния формы.
         // Используем оператор || '' для полей, которые могут быть null из бэкенда, чтобы в поле ввода была пустая строка, а не "null".
         setFullName(profile.full_name || '');
         setContactPhone(profile.contact_phone || '');
         setContactAddress(profile.contact_address || '');
         // TODO: Добавить предзаполнение других полей профиля пациента
      }
       // Сбрасываем локальную ошибку формы при смене профиля (например, при загрузке нового)
       setFormLocalError(null);
   }, [profile]); // Зависимость: эффект срабатывает при изменении пропса profile


   // Обработчик отправки формы. Вызывается при нажатии на кнопку типа submit.
   const handleSubmit = (event) => {
      event.preventDefault(); // Предотвращаем стандартную отправку формы браузером.
      setFormLocalError(null); // Сбрасываем предыдущие локальные ошибки валидации формы.

      // TODO: Добавить валидацию полей на фронтенде, если необходимо (например, проверка формата телефона, адреса).
      // if (!full_name) { setFormLocalError("ФИО обязательно."); return; }


      // Формируем объект с данными для отправки на бэкенд.
      // Используем null для полей, которые остались пустыми, так как на бэкенде они ожидаются как Optional[str].
      const profileData = {
         full_name: full_name || null, // Если full_name пустая строка, отправляем null
         contact_phone: contact_phone || null,
         contact_address: contact_address || null,
         // TODO: Добавить другие поля профиля пациента из состояний
      };

      // Вызываем функцию onSave, переданную из родительского компонента (ProfileSettingsPage).
      // Родительский компонент ответственен за отправку запроса на бэкенд, обработку ответа (успех/ошибка)
      // и обновление состояний isLoading/error/saveSuccess.
      // onSave является асинхронной функцией.
      onSave(profileData); // Вызываем функцию сохранения, передавая ей данные формы.

      // Сообщение об успехе или ошибке после сохранения будет отображаться в родительском компоненте (ProfileSettingsPage)
      // с использованием состояний saveSuccess и error.

      // setFormLocalError("Ошибка сохранения профиля."); // Пример локальной ошибки формы - не лучший UX, лучше использовать ошибку из родителя.
   };


   return (
      // Box из MUI как контейнер для формы. component="form" для семантики.
      // onSubmit={handleSubmit} привязывает отправку формы к нашему обработчику.
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}> {/* mt: margin-top (2 * theme.spacing) */}
         {/* Заголовок для раздела формы */}
         <Typography variant="h6" gutterBottom> {/* variant="h6" - стиль заголовка, gutterBottom - добавляет отступ снизу */}
            Информация о Пациенте
         </Typography>

         {/* Поля ввода MUI TextField */}
         {/* Используем margin="normal" для стандартных отступов между полями */}
         {/* fullWidth делает поле на всю ширину родительского контейнера */}
         {/* variant="outlined" добавляет рамку вокруг поля */}
         {/* Эти свойства (margin, fullWidth, variant) могут быть настроены в теме MUI global defaults для TextField */}

         <TextField
            label="ФИО" // Метка поля
            id="patient-full-name" // ID поля
            value={full_name} // Значение из состояния
            onChange={(e) => setFullName(e.target.value)} // Обработчик изменения
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
            // variant="outlined" // Настроено в теме
            // required // Сделать поле обязательным, если нужно
         />

         <TextField
            label="Телефон"
            id="patient-contact-phone"
            value={contact_phone}
            onChange={(e) => setContactPhone(e.target.value)}
            type="tel" // Указываем тип tel для клавиатуры на мобильных
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
            // variant="outlined" // Настроено в теме
         />

         <TextField
            label="Адрес"
            id="patient-contact-address"
            value={contact_address}
            onChange={(e) => setContactAddress(e.target.value)}
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
            // variant="outlined" // Настроено в теме
         />

         {/* TODO: Добавить поля для медицинской информации, если они будут */}
         {/* Например: тип крови, аллергии (можно использовать TextField с multiline={true} или Textarea) */}


          {/* Отображение локальной ошибки валидации формы */}
         {formLocalError && (
            // Typography для отображения ошибки
            <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center', width: '100%' }}>
              {formLocalError}
            </Typography>
         )}

          {/* Отображение ошибки сохранения из родителя (если нужно отображать внутри формы) */}
           {/* {error && (
              <Typography color="error" sx={{ mt: 2, mb: 2, textAlign: 'center', width: '100%' }}>
                {error}
              </Typography>
           )} */}


          {/* Контейнер для кнопки сохранения. Центрируем ее. */}
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
             {/* Кнопка сохранения формы */}
             <Button
               type="submit" // Тип submit, чтобы привязать к onSubmit формы
               variant="contained" // Стиль кнопки с заливкой (цвет primary из темы)
               color="primary" // Явно указываем цвет
               disabled={isLoading} // Кнопка неактивна во время сохранения (isLoading передается из родителя ProfileSettingsPage)
             >
                {/* Текст кнопки меняется на индикатор загрузки во время сохранения */}
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить Профиль Пациента'}
             </Button>
         </Box>
      </Box>
   );
}

export default PatientProfileForm; // Экспорт компонента по умолчанию