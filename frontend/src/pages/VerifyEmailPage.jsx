// frontend/src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState, useRef } from 'react'; // Добавляем useRef
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button } from "@nextui-org/react";


function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Состояния для отображения статуса и сообщений пользователю
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [message, setMessage] = useState('Проверяем токен подтверждения...');

  // Реф для отслеживания, был ли запрос на бэкенд уже отправлен
  const requestSentRef = useRef(false); // Изначально запрос не отправлен

  useEffect(() => {
    // Получаем параметры запроса
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    // Проверяем наличие токена И не был ли запрос уже отправлен
    // Если токен отсутствует или запрос уже отправлен, прекращаем выполнение эффекта
    if (!token) {
      setVerificationStatus('no-token');
      setMessage('Токен подтверждения отсутствует в ссылке. Пожалуйста, убедитесь, что вы перешли по полной ссылке из письма.');
      return;
    }

    // Если токен есть И запрос еще не был отправлен
    if (token && !requestSentRef.current) {

        // Отмечаем, что запрос на бэкенд сейчас будет отправлен
        requestSentRef.current = true; // Устанавливаем реф в true

        // Определяем асинхронную функцию для отправки запроса
        const verifyEmail = async () => {
           // Устанавливаем статус загрузки перед отправкой запроса
          setVerificationStatus('loading');
          setMessage('Проверяем токен подтверждения...');

          try {
            // Отправляем GET запрос на бэкенд /verify-email
            const response = await api.get('/verify-email', {
              params: { token: token }
            });

            // Если запрос успешен (статус 200)
            if (response.data && response.data.message) {
              setVerificationStatus('success');
              setMessage(response.data.message);
              // Опционально: перенаправить на логин через несколько секунд
               setTimeout(() => navigate('/login'), 3000); // Пример: перенаправление через 3 секунды

            } else {
               setVerificationStatus('success');
               setMessage("Ваш Email успешно подтвержден!");
                setTimeout(() => navigate('/login'), 3000); // Перенаправление
            }


          } catch (error) {
            console.error('Email verification failed', error);

            const errorMessage = error.response?.data?.detail || "Произошла ошибка при подтверждении Email.";

            if (errorMessage.includes("expired")) {
                 setVerificationStatus('expired');
                 setMessage("Срок действия токена подтверждения истек. Пожалуйста, запросите новое письмо с подтверждением.");
            } else if (errorMessage.includes("Invalid")) {
                 setVerificationStatus('invalid');
                 setMessage("Неверный токен подтверждения. Пожалуйста, проверьте ссылку или запросите новое письмо.");
            } else {
                setVerificationStatus('error');
                setMessage(errorMessage);
            }
          }
           // Нет блока finally, так как статус устанавливается внутри try/catch
        };

        // Вызываем асинхронную функцию проверки email
        verifyEmail();

    } // Конец if (token && !requestSentRef.current)


    // Этот эффект запускается при монтировании и изменении location.search
  }, [location.search, navigate]); // Зависимости

    // Определяем класс для сообщения в зависимости от статуса для стилизации
  let messageClass = 'message-status-loading';
  if (verificationStatus === 'success') messageClass = 'message-status-success';
  else if (verificationStatus === 'error' || verificationStatus === 'expired' || verificationStatus === 'invalid' || verificationStatus === 'no-token') messageClass = 'message-status-error';


  // Отображение UI в зависимости от verificationStatus
  return (
    <div className="form-container">
      <h1>Подтверждение Email</h1>

      {/* Отображаем сообщение с динамическим классом */}
      <p className={messageClass}>{message}</p>


      {/* Отображаем кнопку "Перейти на страницу входа" после завершения загрузки (кроме статуса 'loading') */}
      {/* Кнопка не видна, пока статус 'loading' */}
      {verificationStatus !== 'loading' && (
         <div className="button-group" style={{marginTop: '30px'}}>
             {/* Кнопка всегда ведет на страницу логина */}
             <Button color="primary" onClick={() => navigate('/login')}>Перейти на страницу входа</Button>
         </div>
      )}

      {/* TODO: Для статусов 'expired' или 'invalid', можно добавить кнопку "Запросить новое письмо" */}

    </div>
  );
}

export default VerifyEmailPage;