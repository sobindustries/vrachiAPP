// frontend/src/pages/HomePage.jsx
import React from 'react';
import useAuthStore from '../stores/authStore'; // Импортируем стор аутентификации
import { Link } from 'react-router-dom'; // Импортируем Link для навигации

function HomePage() {
  // Получаем статус авторизации и данные пользователя из стора
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      <h1>Главная Страница</h1>

      {isAuthenticated ? (
        // Контент для авторизованных пользователей
        <div>
          <h2>Добро пожаловать, {user?.email} ({user?.role})!</h2> {/* Приветствие с email и ролью */}
          <p>Вы успешно авторизованы.</p>
          {/* TODO: Добавить ссылки на личный кабинет, поиск врачей и т.д. */}
          <p><Link to="/profile">Перейти в Мой Профиль</Link></p> {/* Ссылка на профиль */}
          {/* <p><Link to="/search-doctors">Найти врача</Link></p> */}
          {/* <p><Link to="/history">История консультаций</Link></p> */}
        </div>
      ) : (
        // Контент для неавторизованных пользователей
        <div>
          <h2>Добро пожаловать на платформу онлайн-консультаций с врачами.</h2>
          <p>Пройдите быструю регистрацию и найдите подходящего специалиста.</p>
          {/* TODO: Добавить кнопки "Войти" и "Зарегистрироваться" */}
           <div style={{marginTop: '20px'}}>
             <Link to="/register"><button className="btn btn-medical-blue">Зарегистрироваться</button></Link> {/* Используем компонент Button или просто styled button */}
             <span style={{margin: '0 10px'}}>или</span>
             <Link to="/login"><button className="btn btn-secondary">Войти</button></Link>
           </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; // Экспорт компонента по умолчанию