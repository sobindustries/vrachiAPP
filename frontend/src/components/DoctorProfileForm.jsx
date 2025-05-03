// frontend/src/components/DoctorProfileForm.jsx
import React, { useState, useEffect } from 'react';

// Импортируем компоненты Material UI
import TextField from '@mui/material/TextField'; // Поле ввода текста
import Button from '@mui/material/Button';     // Кнопка
import Box from '@mui/material/Box';           // Универсальный контейнер для лейаута
import Typography from '@mui/material/Typography'; // Текст и заголовки
import CircularProgress from '@mui/material/CircularProgress'; // Индикатор загрузки
import Select from '@mui/material/Select';     // Для выпадающего списка специализаций
import MenuItem from '@mui/material/MenuItem';   // Пункты списка
import FormControl from '@mui/material/FormControl'; // Контейнер для Select с меткой
import InputLabel from '@mui/material/InputLabel'; // Метка для Select
// TODO: Возможно, понадобится Autocomplete или Chip для выбора нескольких районов из списка


// Компонент формы для профиля Врача
// Используется на странице ProfileSettingsPage для создания или редактирования профиля Врача.
// Принимает: profile, onSave, isLoading (сохранение), error (сохранение).
function DoctorProfileForm({ profile, onSave, isLoading, error }) { // Переименовал isLoading/error для ясности в props
   // Состояния формы, предзаполненные данными из пропса profile
   const [full_name, setFullName] = useState('');
   const [specialization, setSpecialization] = useState(''); // Будет значением из списка
   const [experience_years, setExperienceYears] = useState(''); // Опыт работы в годах (число)
   const [education, setEducation] = useState(''); // Текст образования
   const [cost_per_consultation, setCostPerConsultation] = useState(''); // Стоимость (число)
   const [practice_areas, setPracticeAreas] = useState(''); // Пока строка, потом будет выбор из списка (например, массив строк или ID)

   // Локальное состояние для ошибки валидации формы на фронтенде
   const [formLocalError, setFormLocalError] = useState(null);

   // TODO: Состояния для списков специализаций и районов (будут загружаться с бэкенда)
   // const [specializationsList, setSpecializationsList] = useState([]);
   // const [areasList, setAreasList] = useState([]);
   // const [isListsLoading, setIsListsLoading] = useState(true); // Флаг загрузки списков

   // Пример статического списка специализаций (временно, пока нет API)
   const staticSpecializations = [
       'Терапевт', 'Педиатр', 'Хирург', 'Невролог', 'Кардиолог', 'Окулист', 'ЛОР', 'Стоматолог', 'Гейнеколог' // TODO: Добавить полный список
   ];

    // Пример статического списка районов Ташкента (временно, пока нет API)
    const staticAreas = [
        'Алмазарский', 'Бектемирский', 'Мирабадский', 'Мирзо-Улугбекский', 'Сергелийский',
        'Учтепинский', 'Чиланзарский', 'Шайхантахурский', 'Юнусабадский', 'Яккасарайский', 'Яшнабадский'
    ]; // TODO: Добавить полный список районов Ташкента

   // Эффект для предзаполнения формы при получении данных профиля из пропсов.
   useEffect(() => {
      if (profile) {
         setFullName(profile.full_name || '');
         setSpecialization(profile.specialization || '');
         // TODO: Преобразовать опыт работы из строки ("5 лет") в число лет (5)
         // Регулярное выражение \D находит все нецифровые символы, replace заменяет их на пустую строку. parseInt парсит оставшиеся цифры.
         setExperienceYears(profile.experience ? parseInt(profile.experience.replace(/\D/g, '')) || '' : ''); // Пример парсинга "5 лет" в 5
         setEducation(profile.education || ''); // Текст образования
         setCostPerConsultation(profile.cost_per_consultation || ''); // Числовое поле
         setPracticeAreas(profile.practice_areas || ''); // Пока строка, потом массив
         // is_verified - не редактируется пользователем
      }
       // Сбрасываем локальную ошибку формы при смене профиля
       setFormLocalError(null);
   }, [profile]); // Зависимость: эффект срабатывает при изменении пропса profile

   // TODO: Эффект для загрузки списков специализаций и районов с бэкенда
   // useEffect(() => {
   //    const fetchLists = async () => {
   //       setIsListsLoading(true);
   //       try {
   //          const specResponse = await api.get('/specializations'); // TODO: Создать этот эндпоинт на бэкенде
   //          setSpecializationsList(specResponse.data);
   //          const areasResponse = await api.get('/areas'); // TODO: Создать этот эндпоинт на бэкенде (вернет список районов Ташкента)
   //          setAreasList(areasResponse.data);
   //       } catch (err) {
   //          console.error("Failed to load lists:", err);
   //          // TODO: Обработка ошибок загрузки списков
   //       } finally {
   //          setIsListsLoading(false);
   //       }
   //    };
   //    fetchLists();
   // }, []); // Пустой массив зависимостей: эффект запускается один раз при монтировании


   // Обработчик отправки формы
   const handleSubmit = (event) => {
      event.preventDefault();
      setFormLocalError(null); // Сбрасываем локальные ошибки валидации

      // Валидация на фронтенде: специализация и стоимость обязательны
      if (!specialization) {
          setFormLocalError("Пожалуйста, укажите специализацию.");
          return;
      }
       // Проверка, что стоимость является числом и больше 0
      const cost = parseInt(cost_per_consultation);
      if (isNaN(cost) || cost <= 0) {
           setFormLocalError("Пожалуйста, укажите корректную стоимость консультации (число больше 0).");
           return;
      }
       // Проверка, что опыт работы является числом (если заполнено)
       const experience = parseInt(experience_years);
       if (experience_years && (isNaN(experience) || experience < 0)) {
            setFormLocalError("Пожалуйста, укажите корректный опыт работы (число лет).");
            return;
       }
        // TODO: Добавить валидацию для районов практики (например, что это массив строк или ID)


      // Формируем данные для отправки на бэкенд
      const profileData = {
         full_name: full_name || null,
         specialization: specialization, // Обязательное поле (значение из Select)
         experience: experience_years ? `${experience_years} лет` : null, // TODO: Сохранять опыт как число на бэкенде? Имя поля 'experience'
         education: education || null, // Текст образования
         cost_per_consultation: cost, // Отправляем как число
         practice_areas: practice_areas || null, // TODO: Отправлять как массив ID или строк? Имя поля 'practice_areas'
      };

      // Вызываем функцию onSave, переданную из родительского компонента.
      // onSave сам установит isLoading и error.
      onSave(profileData); // Вызываем функцию сохранения

      // setFormLocalError("Ошибка сохранения профиля врача."); // Пример локальной ошибки формы

   };


   return (
      // Box как контейнер для формы
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}> {/* mt: margin-top */}
         {/* Заголовок формы */}
         <Typography variant="h6" gutterBottom>
            Информация о Враче
         </Typography>

         {/* TODO: Отобразить статус верификации */}
         {/*profile && (
              <Typography variant="body1" sx={{marginBottom: 2, fontWeight: 'bold'}}>
                 Статус верификации: {profile.is_verified ?
                    <span style={{color: 'green'}}>Верифицирован</span> :
                    <span style={{color: 'orange'}}>Ожидает верификации</span>
                 }
              </Typography>
         )*/}

         {/* Поля ввода MUI TextField */}
         {/* Используем margin="normal" для стандартных отступов, fullWidth, variant="outlined" - настроено в теме */}
         <TextField
            label="ФИО"
            id="doctor-full-name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            // required // ФИО врача опционально по ТЗ
         />

         {/* Выпадающий список Специализация */}
          {/* TODO: Отобразить лоадер списков, если isListsLoading */}
         <FormControl fullWidth margin="normal">
             <InputLabel id="doctor-specialization-label">Специализация *</InputLabel>
             <Select
               labelId="doctor-specialization-label"
               id="doctor-specialization"
               value={specialization}
               label="Специализация *" // Должен совпадать с текстом InputLabel
               onChange={(e) => setSpecialization(e.target.value)}
               required // Обязательное поле
             >
                {/* TODO: Заменить на реальные данные из specializationsList (загруженные с бэкенда) */}
               <MenuItem value=""><em>Выберите специализацию</em></MenuItem> {/* Пустой пункт для выбора */}
               {staticSpecializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem> // Используем значение специализации как key и value
               ))}
               {/* {specializationsList.map((spec) => (
                    <MenuItem key={spec.id} value={spec.name}>{spec.name}</MenuItem> // Пример, если бэкенд вернет {id, name}
               ))} */}
             </Select>
         </FormControl>


         <TextField
            label="Опыт работы (лет)"
            id="doctor-experience"
            value={experience_years}
            onChange={(e) => setExperienceYears(e.target.value)}
            type="number" // Тип number для ввода числа
            inputProps={{ min: 0 }} // Минимальное значение 0 лет
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
         />

         {/* Поле для Образования (многострочный ввод Textarea) */}
          {/* TODO: Сделать отдельные поля ВУЗ и Год окончания? Или оставить как текст? По ТЗ "образование" */}
         <TextField
            label="Образование"
            id="doctor-education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            multiline // Делает поле многострочным
            rows={4} // Количество видимых строк по умолчанию
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
         />


         <TextField
            label="Стоимость консультации (сум)" // Указываем валюту в метке
            id="doctor-cost"
            value={cost_per_consultation}
            onChange={(e) => setCostPerConsultation(e.target.value)}
            type="number" // Тип number
            required // Обязательное поле
            inputProps={{ min: 1 }} // Минимальное значение 1
            // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
         />

         {/* Поле для Районов практики */}
          {/* TODO: Сделать выбор из списка районов Ташкента (можно использовать Select с multiple) */}
          {/* TODO: Загрузить список районов с бэкенда */}
         <TextField
            label="Районы практики (через запятую)" // Пока строка
            id="doctor-areas"
            value={practice_areas}
            onChange={(e) => setPracticeAreas(e.target.value)}
             // margin="normal" // Настроено в теме
            // fullWidth // Настроено в теме
         />

          {/* Отображение локальной ошибки валидации формы */}
         {formLocalError && (
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить Профиль Врача'}
             </Button>
         </Box>
      </Box>
   );
}

export default DoctorProfileForm; // Экспорт компонента по умолчанию