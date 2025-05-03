# backend/schemas.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List # Добавляем List, может понадобиться позже для списков


# --- Pydantic модели для базовых пользователей и аутентификации ---

# Модель для данных, приходящих при регистрации
class UserCreate(BaseModel):
    email: EmailStr # FastAPI/Pydantic автоматически проверит, что это валидный email
    password: str = Field(..., min_length=8) # Пароль, обязателен, мин. длина 8 символов
    # Role validation: must be 'patient', 'doctor', or 'admin'
    role: str = Field(..., pattern="^(patient|doctor|admin)$")


# Модель для данных, возвращаемых после регистрации и при получении информации о пользователе (включая is_active)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool # <-- Это поле добавлено, чтобы фронтенд знал статус активации
    role: str

    # Настройка для работы с SQLAlchemy ORM
    # from_attributes = True позволяет Pydantic читать данные прямо из объектов SQLAlchemy
    # Это замена устаревшего orm_mode = True в Pydantic V2+
    class Config:
        from_attributes = True


# Модель для возврата токена при авторизации
class Token(BaseModel):
    access_token: str
    token_type: str


# --- Pydantic модели для профилей Пациента и Врача ---

# Модель для данных, приходящих при создании или обновлении профиля Пациента
class PatientProfileCreateUpdate(BaseModel):
    # Optional указывает, что поле не обязательно для заполнения.
    # Field(None, ...) указывает значение по умолчанию None, если поле отсутствует в запросе.
    # max_length добавляет валидацию длины строки.
    full_name: Optional[str] = Field(None, max_length=255)
    contact_phone: Optional[str] = Field(None, max_length=50)
    contact_address: Optional[str] = Field(None, max_length=255)
    # TODO: Добавить поля для медицинской информации, если они будут собираться (с учетом приватности)
    # medical_info: Optional[str] = None # Пример


# Модель для данных, возвращаемых при запросе профиля Пациента
class PatientProfileResponse(BaseModel):
    id: int
    user_id: int # ID связанного пользователя
    full_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    # TODO: Добавить поля для медицинской информации, если они будут собираться

    # Настройка для работы с SQLAlchemy ORM
    class Config:
        from_attributes = True


# Модель для данных, приходящих при создании или обновлении профиля Врача
class DoctorProfileCreateUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=255)
    specialization: str = Field(..., max_length=255) # Специализация обязательна. '...' указывает, что поле обязательное.
    experience: Optional[str] = Field(None, max_length=255)
    education: Optional[str] = Field(None, max_length=1000) # Текст образования может быть длиннее
    # Стоимость консультации, обязательна, должна быть больше 0
    cost_per_consultation: int = Field(..., gt=0) # gt=0 - greater than 0
    practice_areas: Optional[str] = Field(None, max_length=511)
    # Поле is_verified не включаем в модель для создания/обновления, т.к. его устанавливает Администратор


# Модель для данных, возвращаемых при запросе профиля Врача
class DoctorProfileResponse(BaseModel):
    id: int
    user_id: int # ID связанного пользователя
    full_name: Optional[str] = None
    specialization: str
    experience: Optional[str] = None
    education: Optional[str] = None
    cost_per_consultation: int
    practice_areas: Optional[str] = None
    is_verified: bool # Статус верификации (возвращаем в ответе)

    # Настройка для работы с SQLAlchemy ORM
    class Config:
        from_attributes = True


# TODO: Добавить Pydantic модели для других сущностей:
# class ConsultationCreate(BaseModel): ...
# class ConsultationResponse(BaseModel): ...
# class MessageCreate(BaseModel): ...
# class MessageResponse(BaseModel): ...
# class ReviewCreate(BaseModel): ...
# class ReviewResponse(BaseModel): ...