import React from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Divider } from '@nextui-org/react';
import useAuthStore from '../stores/authStore';

// Компонент страницы истории консультаций и платежей
function HistoryPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState("consultations");
  
  // Заглушка для данных консультаций (в будущем будет получаться с бэкенда)
  const mockConsultations = [
    {
      id: 1,
      doctorName: "Иванов Иван Иванович",
      specialization: "Терапевт",
      date: "2023-05-15",
      time: "14:00",
      duration: 30,
      status: "completed", // completed, upcoming, cancelled
      cost: 1500
    },
    {
      id: 2,
      doctorName: "Петрова Анна Сергеевна",
      specialization: "Кардиолог",
      date: "2023-06-20",
      time: "10:30",
      duration: 45,
      status: "upcoming",
      cost: 2000
    },
    {
      id: 3,
      doctorName: "Сидоров Петр Михайлович",
      specialization: "Невролог",
      date: "2023-04-10",
      time: "16:00",
      duration: 60,
      status: "cancelled",
      cost: 2500
    }
  ];
  
  // Заглушка для данных платежей (в будущем будет получаться с бэкенда)
  const mockPayments = [
    {
      id: 101,
      date: "2023-05-15",
      amount: 1500,
      description: "Консультация: Терапевт - Иванов И.И.",
      status: "success" // success, pending, failed
    },
    {
      id: 102,
      date: "2023-06-20",
      amount: 2000,
      description: "Предоплата: Кардиолог - Петрова А.С.",
      status: "pending"
    },
    {
      id: 103,
      date: "2023-04-10",
      amount: 500,
      description: "Возврат за отмену: Невролог - Сидоров П.М.",
      status: "success"
    }
  ];
  
  // Функция для получения цвета статуса консультации
  const getConsultationStatusColor = (status) => {
    switch(status) {
      case "completed": return "success";
      case "upcoming": return "primary";
      case "cancelled": return "danger";
      default: return "default";
    }
  };
  
  // Функция для получения текста статуса консультации
  const getConsultationStatusText = (status) => {
    switch(status) {
      case "completed": return "Завершена";
      case "upcoming": return "Предстоит";
      case "cancelled": return "Отменена";
      default: return "Неизвестно";
    }
  };
  
  // Функция для получения цвета статуса платежа
  const getPaymentStatusColor = (status) => {
    switch(status) {
      case "success": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };
  
  // Функция для получения текста статуса платежа
  const getPaymentStatusText = (status) => {
    switch(status) {
      case "success": return "Успешно";
      case "pending": return "В обработке";
      case "failed": return "Ошибка";
      default: return "Неизвестно";
    }
  };
  
  // Форматирование даты для отображения
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">История</h1>
      
      <Card>
        <CardHeader className="pb-0 pt-4">
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={setActiveTab}
            variant="underlined"
            color="primary"
            fullWidth
          >
            <Tab key="consultations" title="Консультации" />
            <Tab key="payments" title="Платежи" />
          </Tabs>
        </CardHeader>
        
        <Divider className="mt-4" />
        
        <CardBody>
          {activeTab === "consultations" && (
            <Table aria-label="История консультаций">
              <TableHeader>
                <TableColumn>Врач</TableColumn>
                <TableColumn>Дата и время</TableColumn>
                <TableColumn>Длительность</TableColumn>
                <TableColumn>Стоимость</TableColumn>
                <TableColumn>Статус</TableColumn>
              </TableHeader>
              <TableBody items={mockConsultations}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.doctorName}</div>
                        <div className="text-sm text-gray-500">{item.specialization}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{formatDate(item.date)}</div>
                        <div className="text-sm text-gray-500">{item.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.duration} мин.</TableCell>
                    <TableCell>{item.cost} ₽</TableCell>
                    <TableCell>
                      <Chip
                        color={getConsultationStatusColor(item.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getConsultationStatusText(item.status)}
                      </Chip>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          
          {activeTab === "payments" && (
            <Table aria-label="История платежей">
              <TableHeader>
                <TableColumn>Дата</TableColumn>
                <TableColumn>Описание</TableColumn>
                <TableColumn>Сумма</TableColumn>
                <TableColumn>Статус</TableColumn>
              </TableHeader>
              <TableBody items={mockPayments}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount} ₽</TableCell>
                    <TableCell>
                      <Chip
                        color={getPaymentStatusColor(item.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getPaymentStatusText(item.status)}
                      </Chip>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          
          {((activeTab === "consultations" && mockConsultations.length === 0) || 
            (activeTab === "payments" && mockPayments.length === 0)) && (
            <div className="text-center py-8 text-gray-500">
              История {activeTab === "consultations" ? "консультаций" : "платежей"} пуста.
            </div>
          )}
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Примечание: Это демонстрационные данные. Функционал будет полностью доступен в следующей версии платформы.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default HistoryPage; 