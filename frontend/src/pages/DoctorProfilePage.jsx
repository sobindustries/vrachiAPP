import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Divider, Spinner, Chip } from '@nextui-org/react';
import { doctorsApi } from '../api';

// Компонент для секции информации в профиле
const InfoSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
    <div className="pl-2">{children}</div>
  </div>
);

// Компонент страницы профиля врача
function DoctorProfilePage() {
  const { doctorId } = useParams(); // Получаем ID врача из URL
  const navigate = useNavigate();
  
  // Состояния для данных
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Загружаем данные врача при первом рендере
  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        const data = await doctorsApi.getDoctorById(doctorId);
        setDoctor(data);
      } catch (err) {
        setError('Не удалось загрузить информацию о враче. Пожалуйста, попробуйте позже.');
        console.error('Error loading doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctorData();
  }, [doctorId]);
  
  // Обработчик кнопки "Назад к поиску"
  const handleBackToSearch = () => {
    navigate('/search-doctors');
  };
  
  // Заглушка для обработчика "Подать заявку на консультацию"
  const handleRequestConsultation = () => {
    alert("Функционал заявки на консультацию находится в разработке");
  };
  
  // Отображаем индикатор загрузки
  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Отображаем сообщение об ошибке
  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center text-danger py-8">
            <p>{error}</p>
            <Button color="primary" className="mt-4" onClick={handleBackToSearch}>
              Вернуться к поиску врачей
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // Отображаем сообщение, если врач не найден
  if (!doctor) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-8">
            <p>Врач с ID {doctorId} не найден.</p>
            <Button color="primary" className="mt-4" onClick={handleBackToSearch}>
              Вернуться к поиску врачей
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // Форматируем районы практики в массив для отображения
  const practiceAreasArray = doctor.practice_areas 
    ? doctor.practice_areas.split(',').map(area => area.trim())
    : [];
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Button 
          color="default" 
          variant="light" 
          onClick={handleBackToSearch}
        >
          ← Назад к поиску
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardBody className="p-6">
          {/* Шапка профиля */}
          <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-1">
                {doctor.full_name || 'Имя не указано'}
                {doctor.is_verified && (
                  <span className="ml-2 text-xs text-success">✓ Верифицирован</span>
                )}
              </h1>
              <h2 className="text-xl text-gray-600">{doctor.specialization}</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600">Стоимость консультации</p>
                <p className="text-2xl font-bold text-primary">{doctor.cost_per_consultation} ₽</p>
              </div>
            </div>
          </div>
          
          <Divider className="my-4" />
          
          {/* Рейтинг */}
          {doctor.rating !== undefined && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-1 font-bold">{doctor.rating}</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({doctor.reviews_count || 0} {doctor.reviews_count === 1 ? 'отзыв' : 'отзывов'})
              </span>
            </div>
          )}
          
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Левая колонка */}
            <div>
              {doctor.experience && (
                <InfoSection title="Опыт работы">
                  <p>{doctor.experience}</p>
                </InfoSection>
              )}
              
              {doctor.education && (
                <InfoSection title="Образование">
                  <p>{doctor.education}</p>
                </InfoSection>
              )}
            </div>
            
            {/* Правая колонка */}
            <div>
              {practiceAreasArray.length > 0 && (
                <InfoSection title="Районы практики">
                  <div className="flex flex-wrap gap-2">
                    {practiceAreasArray.map((area, index) => (
                      <Chip key={index} color="primary" variant="flat">
                        {area}
                      </Chip>
                    ))}
                  </div>
                </InfoSection>
              )}
              
              {/* Кнопка заявки на консультацию */}
              <div className="mt-6">
                <Button 
                  color="primary" 
                  className="w-full" 
                  size="lg"
                  onClick={handleRequestConsultation}
                >
                  Подать заявку на консультацию
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  После подачи заявки врач свяжется с вами для уточнения деталей и назначения времени консультации.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Заглушка для отзывов */}
      <Card>
        <CardBody className="p-6">
          <h2 className="text-xl font-semibold mb-4">Отзывы пациентов</h2>
          <p className="text-gray-500 text-center py-6">
            Раздел отзывов находится в разработке.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export default DoctorProfilePage; 