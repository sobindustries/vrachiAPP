// frontend/src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation для доступа к параметрам URL, useNavigate для перенаправления
import api from '../api'; // Импортируем наш API сервис
import Button from '../components/Button'; // Импортируем компонент Button


function VerifyEmailPage() {
  const location = useLocation(); // Хук для доступа к объекту location (содержит информацию о текущем URL)
  const navigate = useNavigate(); // Хук для программной навигации

  // Состояния для отображения статуса и сообщений пользователю
  const [verificationStatus, setVerificationStatus] = useState('loading'); // Состояние статуса: 'loading', 'success', 'error', 'expired', 'invalid'
  const [message, setMessage] = useState('Проверяем токен подтверждения...'); // Сообщение для пользователя

  // Эффект, который запускается один раз при загрузке страницы (или при изменении URL)
  useEffect(() => {
    // Получаем параметры запроса из URL (часть URL после ?)
    const params = new URLSearchParams(location.search);
    // Извлекаем значение параметра 'token'. Ожидаем URL типа /verify-email?token=ВАШ_ТОКЕН
    const token = params.get('token');

    // Проверяем, есть ли токен в URL
    if (!token) {
      // Если токен отсутствует, устанавливаем статус ошибки и соответствующее сообщение
      setVerificationStatus('error');
      setMessage('Токен подтверждения отсутствует в ссылке.');
      return; // Прекращаем выполнение эффекта, если нет токена
    }

    // Если токен найден, определяем асинхронную функцию для отправки запроса на бэкенд
    const verifyEmail = async () => {
      try {
        // Отправляем GET запрос на эндпоинт бэкенда /verify-email
        // Передаем токен как параметр запроса 'token'
        const response = await api.get('/verify-email', {
          params: { token: token } // { params: { token: 'значение_токена' } }
        });

        // Если запрос успешен (бэкенд вернул статус 200 OK)
        // Ожидаем, что бэкенд вернет JSON с полем 'message' при успехе.
        if (response.data && response.data.message) {
          setVerificationStatus('success'); // Устанавливаем статус успеха
          setMessage(response.data.message); // Отображаем сообщение от бэкенда
        } else {
           // Если бэкенд вернул 200, но структура ответа не соответствует ожидаемой
           setVerificationStatus('success'); // Все равно считаем успешным, но используем стандартное сообщение
           setMessage("Ваш Email успешно подтвержден!");
        }


      } catch (error) {
        // Если при выполнении запроса произошла ошибка (например, бэкенд вернул статус 400 Bad Request или другой)
        console.error('Email verification failed', error);
        setVerificationStatus('error'); // Устанавливаем статус ошибки
        // Пытаемся извлечь сообщение об ошибке из ответа бэкенда
        const errorMessage = error.response?.data?.detail || "Произошла ошибка при подтверждении Email.";

        // Дополнительная обработка для более конкретных сообщений на основе текста ошибки
        if (errorMessage.includes("expired")) {
             setVerificationStatus('expired'); // Отдельный статус для просроченного токена
             setMessage("Срок действия токена подтверждения истек.");
        } else if (errorMessage.includes("Invalid")) {
             setVerificationStatus('invalid'); // Отдельный статус для неверного токена
             setMessage("Неверный токен подтверждения.");
        } else {
            setMessage(errorMessage); // Используем общее сообщение об ошибке
        }
      }
    };

    // Вызываем асинхронную функцию проверки email
    verifyEmail();

    // Этот эффект запускается при изменении location.search (параметров URL)
    // Это важно, если пользователь переходит по разным ссылкам подтверждения на одной странице (хотя это маловероятно)
  }, [location.search]);


  // Отображение UI
  return (
    <div className="form-container"> {/* Используем общий контейнер для форм */}
      <h1>Подтверждение Email</h1>
      <p>{message}</p> {/* Отображаем текущее сообщение о статусе */}

      {/* Отображаем кнопку "Перейти на страницу входа" после завершения загрузки (независимо от успеха или ошибки) */}
      {/* Кнопка не видна, пока статус 'loading' */}
      {verificationStatus !== 'loading' && (
         <Button variant="medical-blue" onClick={() => navigate('/login')}>Перейти на страницу входа</Button>
      )}

      {/* TODO: Добавить разные визуальные индикаторы для разных статусов (иконки, цвета текста и т.д.) */}
      {/* {verificationStatus === 'loading' && <p>Загрузка...</p>} */}
      {/* {verificationStatus === 'success' && <p className="success-message">{message}</p>} */}
      {/* {verificationStatus === 'error' && <p className="error-message">{message}</p>} */}
      {/* {verificationStatus === 'expired' && <p className="error-message">{message}</p>} */}
      {/* {verificationStatus === 'invalid' && <p className="error-message">{message}</p>} */}

    </div>
  );
}

export default VerifyEmailPage; // Экспорт компонента по умолчанию