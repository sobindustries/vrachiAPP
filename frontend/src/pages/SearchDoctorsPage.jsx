import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, CardBody, CardFooter, Divider, Pagination, Spinner } from '@nextui-org/react';
import { doctorsApi } from '../api';

// Компонент карточки врача в списке
const DoctorCard = ({ doctor, onClick }) => {
  return (
    <Card 
      className="mb-4 hover:shadow-lg transition-shadow"
      isPressable 
      onPress={onClick}
    >
      <CardBody className="p-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-primary">{doctor.full_name || 'Имя не указано'}</h3>
          <p className="text-sm text-gray-500">{doctor.specialization}</p>
          <Divider className="my-2" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Стоимость: {doctor.cost_per_consultation} ₽</span>
            {doctor.is_verified && (
              <span className="text-xs text-success">✓ Верифицирован</span>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter className="bg-gray-50 p-2">
        <Button size="sm" color="primary" fullWidth>
          Посмотреть профиль
        </Button>
      </CardFooter>
    </Card>
  );
};

// Компонент страницы поиска врачей
function SearchDoctorsPage() {
  const navigate = useNavigate();
  
  // Состояния для фильтров
  const [specialization, setSpecialization] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Состояния для данных
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Состояния для пагинации
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Функция для загрузки данных с применением фильтров
  const loadDoctors = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Подготавливаем фильтры для запроса
      const filters = {};
      if (specialization) filters.specialization = specialization;
      if (practiceArea) filters.practice_area = practiceArea;
      if (minPrice) filters.min_price = parseInt(minPrice, 10);
      if (maxPrice) filters.max_price = parseInt(maxPrice, 10);
      
      // Запрашиваем данные с API
      const result = await doctorsApi.getDoctors(filters, pageNum);
      
      // Обновляем состояния
      setDoctors(result.items);
      setTotalPages(result.pages);
      setTotalItems(result.total);
      setPage(result.page);
    } catch (err) {
      setError('Не удалось загрузить список врачей. Пожалуйста, попробуйте позже.');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Загружаем врачей при первом рендере
  useEffect(() => {
    loadDoctors();
  }, []);
  
  // Обработчик нажатия на кнопку поиска
  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors(1); // Сбрасываем на первую страницу при новом поиске
  };
  
  // Обработчик изменения страницы
  const handlePageChange = (pageNum) => {
    loadDoctors(pageNum);
  };
  
  // Обработчик нажатия на карточку врача
  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Поиск врачей</h1>
      
      {/* Форма фильтрации */}
      <form onSubmit={handleSearch} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Специализация"
            placeholder="Например: Терапевт, Кардиолог"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            variant="bordered"
            radius="sm"
          />
          <Input
            label="Район практики"
            placeholder="Например: Центральный, Западный"
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value)}
            variant="bordered"
            radius="sm"
          />
          <Input
            label="Минимальная цена"
            placeholder="От"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
            variant="bordered"
            radius="sm"
          />
          <Input
            label="Максимальная цена"
            placeholder="До"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
            variant="bordered"
            radius="sm"
          />
        </div>
        
        <div className="flex justify-center">
          <Button
            type="submit"
            color="primary"
            isLoading={loading}
            className="px-8"
          >
            Поиск
          </Button>
        </div>
      </form>
      
      {/* Отображение ошибки */}
      {error && (
        <div className="text-danger text-center mb-4">
          {error}
        </div>
      )}
      
      {/* Индикатор загрузки */}
      {loading && (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Результаты поиска */}
      {!loading && doctors.length === 0 ? (
        <div className="text-center text-gray-500 my-8">
          Нет врачей, соответствующих вашим критериям поиска.
        </div>
      ) : (
        <>
          {/* Счетчик результатов */}
          {!loading && totalItems > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Найдено: {totalItems} {totalItems === 1 ? 'врач' : totalItems >= 2 && totalItems <= 4 ? 'врача' : 'врачей'}
            </p>
          )}
          
          {/* Список врачей */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onClick={() => handleDoctorClick(doctor.id)}
              />
            ))}
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                initialPage={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchDoctorsPage; 