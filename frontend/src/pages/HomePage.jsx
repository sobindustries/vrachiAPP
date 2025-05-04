// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button } from '@nextui-org/react';
import useAuthStore from '../stores/authStore';
import GoogleProfileForm from '../components/GoogleProfileForm';

function HomePage() {
  const { user, needsProfileUpdate } = useAuthStore();
  const navigate = useNavigate();
  
  // Если требуется обновление профиля, показываем форму
  if (needsProfileUpdate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
        <div className="w-full max-w-2xl">
          <GoogleProfileForm onCompleted={() => window.location.reload()} />
        </div>
      </div>
    );
  }
  
  // Определяем приветствие в зависимости от роли
  const welcomeText = user?.role === 'doctor' 
    ? 'Добро пожаловать в ваш личный кабинет врача!' 
    : 'Добро пожаловать в ваш личный кабинет!';
  
  // Карточки для пациента
  const patientCards = [
    {
      title: 'Найти врача',
      description: 'Поиск врачей по специализации и записаться на консультацию',
      icon: '🔍',
      action: () => navigate('/search-doctors')
    },
    {
      title: 'История консультаций',
      description: 'Просмотр истории ваших консультаций и платежей',
      icon: '📋',
      action: () => navigate('/history')
    },
    {
      title: 'Настройки профиля',
      description: 'Обновление личной информации и настройки аккаунта',
      icon: '⚙️',
      action: () => navigate('/profile')
    }
  ];
  
  // Карточки для врача
  const doctorCards = [
    {
      title: 'Мои консультации',
      description: 'Управление текущими и предстоящими консультациями',
      icon: '📅',
      action: () => navigate('/history')
    },
    {
      title: 'Настройки профиля',
      description: 'Обновление профессиональной информации и расписания',
      icon: '⚙️',
      action: () => navigate('/profile')
    },
    {
      title: 'Аналитика',
      description: 'Статистика консультаций и отзывы пациентов',
      icon: '📊',
      action: () => alert('Функционал в разработке')
    }
  ];
  
  // Выбираем набор карточек в зависимости от роли
  const serviceCards = user?.role === 'doctor' ? doctorCards : patientCards;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{welcomeText}</h1>
          <p className="text-gray-600">
            {user?.role === 'doctor' 
              ? 'Здесь вы можете управлять консультациями и настраивать ваш профиль.'
              : 'Здесь вы можете искать врачей, управлять консультациями и просматривать историю.'
            }
          </p>
        </div>
        
        {/* Карточки сервисов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-6 flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <Button 
                  color="primary" 
                  className="mt-auto"
                  onClick={card.action}
                >
                  Перейти
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
        
        {/* Информация о статусе платформы */}
        <Card className="mt-12 bg-blue-50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Статус платформы</h3>
                <p className="text-gray-600">Все системы работают в штатном режиме</p>
              </div>
              <div className="bg-success rounded-full w-3 h-3"></div>
            </div>
          </CardBody>
        </Card>
        
        {/* Ссылки на помощь */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Нужна помощь? <a href="#" className="text-primary hover:underline">Связаться с поддержкой</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;