// frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { Input, Button, Spinner, Select, SelectItem, Checkbox } from '@nextui-org/react';

// Компонент формы регистрации
// Принимает функцию onSubmit (которая будет вызывать регистрацию из стора),
// isLoading (статус загрузки из стора), и error (ошибка из стора)
function RegisterForm({ onSubmit, isLoading, error }) {
  // Основные поля для регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Персональные данные
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Роль пользователя
  const [role, setRole] = useState('patient');
  
  // Согласие с условиями
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Состояние для локальных ошибок
  const [formError, setFormError] = useState(null);

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError(null);

    // Валидация полей
    if (!firstName || !lastName) {
      setFormError("Пожалуйста, укажите имя и фамилию.");
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError("Пароли не совпадают.");
      return;
    }
    
    if (password.length < 8) {
      setFormError("Пароль должен содержать не менее 8 символов.");
      return;
    }
    
    if (!agreeToTerms) {
      setFormError("Необходимо согласиться с условиями использования.");
      return;
    }

    // Формируем данные пользователя
    const userData = {
      email,
      password,
      role,
      profile: {
        firstName,
        lastName,
        middleName,
        phone
      }
    };

    // Вызываем функцию onSubmit, переданную из родительского компонента
    onSubmit(userData);
  };

  const roles = [
    { value: 'patient', label: 'Пациент' },
    { value: 'doctor', label: 'Врач' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Блок персональных данных */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Input
          id="register-first-name"
          label="Имя"
          placeholder="Введите ваше имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          variant="bordered"
          isRequired
          labelPlacement="outside"
          radius="sm"
          className="col-span-1"
          classNames={{
            input: "text-base py-2",
            inputWrapper: "py-0 h-auto min-h-[56px]",
            label: "pb-2 text-medium",
            base: "mb-2"
          }}
        />
        
        <Input
          id="register-last-name"
          label="Фамилия"
          placeholder="Введите вашу фамилию"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          variant="bordered"
          isRequired
          labelPlacement="outside"
          radius="sm"
          className="col-span-1"
          classNames={{
            input: "text-base py-2",
            inputWrapper: "py-0 h-auto min-h-[56px]",
            label: "pb-2 text-medium",
            base: "mb-2"
          }}
        />
      </div>

      <Input
        id="register-middle-name"
        label="Отчество"
        placeholder="Введите ваше отчество (если есть)"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        classNames={{
          input: "text-base py-2",
          inputWrapper: "py-0 h-auto min-h-[56px]",
          label: "pb-2 text-medium",
          base: "mb-6"
        }}
      />

      <Input
        id="register-phone"
        label="Телефон"
        placeholder="+998(XX) XXX-XX-XX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        type="tel"
        classNames={{
          input: "text-base py-2",
          inputWrapper: "py-0 h-auto min-h-[56px]",
          label: "pb-2 text-medium",
          base: "mb-6"
        }}
      />

      <Input
        id="register-email"
        label="Email"
        placeholder="Введите ваш email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        variant="bordered"
        isRequired
        labelPlacement="outside"
        radius="sm"
        classNames={{
          input: "text-base py-2",
          inputWrapper: "py-0 h-auto min-h-[56px]",
          label: "pb-2 text-medium",
          base: "mb-6"
        }}
      />

      <Input
        id="register-password"
        label="Пароль"
        placeholder="Минимум 8 символов"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        variant="bordered"
        isRequired
        labelPlacement="outside"
        radius="sm"
        classNames={{
          input: "text-base py-2",
          inputWrapper: "py-0 h-auto min-h-[56px]",
          label: "pb-2 text-medium",
          base: "mb-6"
        }}
      />

      <Input
        id="register-confirm-password"
        label="Повторите пароль"
        placeholder="Введите пароль еще раз"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        variant="bordered"
        isRequired
        labelPlacement="outside"
        radius="sm"
        classNames={{
          input: "text-base py-2",
          inputWrapper: "py-0 h-auto min-h-[56px]",
          label: "pb-2 text-medium",
          base: "mb-6"
        }}
      />

      <Select
        id="register-role"
        label="Я регистрируюсь как"
        selectedKeys={[role]}
        onChange={(e) => setRole(e.target.value)}
        variant="bordered"
        radius="sm"
        labelPlacement="outside"
        classNames={{
          base: "mb-6",
          label: "pb-2 text-medium",
          trigger: "py-2 min-h-[56px]",
          value: "text-base"
        }}
      >
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </Select>

      <Checkbox
        isSelected={agreeToTerms}
        onValueChange={setAgreeToTerms}
        size="sm"
        className="mt-6"
      >
        <span className="ml-1 text-sm">
          Я согласен с <a href="#" className="text-primary hover:underline">условиями использования</a> и <a href="#" className="text-primary hover:underline">политикой конфиденциальности</a>
        </span>
      </Checkbox>

      {/* Контейнер для сообщений об ошибках с фиксированной высотой */}
      <div className="min-h-[60px] mt-4 mb-2">
        {formError && (
          <div className="text-danger text-sm p-3 bg-danger-50 rounded border border-danger-200">
            {formError}
          </div>
        )}
      </div>

      <Button
        type="submit"
        color="primary"
        className="w-full mt-4"
        isLoading={isLoading}
        isDisabled={isLoading || !agreeToTerms}
        size="lg"
      >
        {isLoading ? <Spinner size="sm" color="white" /> : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}

export default RegisterForm; // Экспорт компонента по умолчанию