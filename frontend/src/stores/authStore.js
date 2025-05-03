// frontend/src/stores/authStore.js
import { create } from 'zustand'; // Импортируем функцию create из zustand
import api, { setAuthToken } from '../api'; // Импортируем наш API сервис и функцию для установки токена

// Ключи для Local Storage
const TOKEN_STORAGE_KEY = 'accessToken';
const USER_STORAGE_KEY = 'user';

// Функция для загрузки начального состояния из Local Storage
const loadAuthFromStorage = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = localStorage.getItem(USER_STORAGE_KEY);

  if (token && user) {
    // Если нашли токен и данные пользователя в Local Storage
    setAuthToken(token); // Устанавливаем токен для Axios по умолчанию
    try {
        // Пытаемся распарсить данные пользователя из JSON
        const parsedUser = JSON.parse(user);
         // Проверяем базовую структуру распарсенных данных
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id && parsedUser.email) {
             return { token, user: parsedUser, isAuthenticated: true, isLoading: false, error: null }; // Убедимся, что error сброшен
        } else {
             // Если распарсенные данные не соответствуют ожидаемой структуре
             console.error("User data in local storage is corrupted.");
             // Очищаем Local Storage и сбрасываем состояние
             localStorage.removeItem(TOKEN_STORAGE_KEY);
             localStorage.removeItem(USER_STORAGE_KEY);
             setAuthToken(null);
             return { token: null, user: null, isAuthenticated: false, isLoading: false, error: null };
        }

    } catch (e) {
        // Если не удалось распарсить JSON
        console.error("Failed to parse user from local storage", e);
        // Очищаем Local Storage, если данные повреждены
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setAuthToken(null);
        return { token: null, user: null, isAuthenticated: false, isLoading: false, error: null };
    }
  }
  // Если ничего не нашли в Local Storage
  setAuthToken(null); // Убеждаемся, что токен Axios сброшен
  return { token: null, user: null, isAuthenticated: false, isLoading: false, error: null }; // Убедимся, что error сброшен
};


// Создаем наш стор (хранилище состояния) для аутентификации
// useAuthStore - это хук, который компоненты будут использовать для доступа к состоянию и функциям
const useAuthStore = create((set, get) => ({ // Добавляем 'get' для доступа к текущему состоянию стора
  // Начальное состояние стора
  token: null, // JWT токен доступа
  user: null, // Объект пользователя {id, email, role, is_active}
  isAuthenticated: false, // Флаг, авторизован ли пользователь (наличие валидного токена и пользователя)
  isLoading: true, // Флаг, идет ли загрузка (например, при проверке токена при старте или при выполнении запросов)
  error: null, // Для хранения последней ошибки (например, при логине или регистрации)

  // --- Функции для управления состоянием ---

  // Инициализация стора при старте приложения
  // Загружает состояние из Local Storage и, если токен есть, проверяет его валидность на бэкенде
  initializeAuth: () => {
    const initialState = loadAuthFromStorage(); // Загружаем начальное состояние из Local Storage
    set(initialState); // Устанавливаем его в стор

    // Если нашли токен в Local Storage и пользователь не находится в состоянии загрузки (например, при hot-reload)
    // isValidatingToken флаг поможет избежать многократных запросов при инициализации в development режиме
    if (initialState.isAuthenticated && !get().isLoading && !get().isValidatingToken) {
         set({ isLoading: true, isValidatingToken: true }); // Устанавливаем флаги загрузки и валидации токена
         api.get('/users/me') // Отправляем запрос на бэкенд, чтобы убедиться, что токен все еще валиден и получить актуальные данные пользователя
            .then(response => {
                // Если запрос успешен (токен валиден)
                console.log("Token validated, user data fetched:", response.data);
                set({ user: response.data, isAuthenticated: true, error: null }); // Обновляем данные пользователя в сторе, сбрасываем ошибку
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data)); // Обновляем данные пользователя в Local Storage
            })
            .catch(error => {
                // Если запрос с токеном не удался (например, 401 Unauthorized - токен невалиден или истек, или 404 Not Found)
                console.error("Token validation failed", error);
                // Сбрасываем состояние авторизации
                set({ token: null, user: null, isAuthenticated: false, error: "Session expired or token invalid" });
                localStorage.removeItem(TOKEN_STORAGE_KEY); // Удаляем невалидный токен из Local Storage
                localStorage.removeItem(USER_STORAGE_KEY);
                setAuthToken(null); // Сбрасываем токен в Axios
            })
            .finally(() => {
                 // Завершаем загрузку и валидацию токена
                 set({ isLoading: false, isValidatingToken: false });
            });
    } else if (!initialState.isAuthenticated) {
        // Если токена нет в Local Storage, сразу завершаем загрузку
        set({ isLoading: false, isValidatingToken: false });
    } else {
        // Если isLoading или isValidatingToken уже true (например, при быстрой перезагрузке)
        // Просто устанавливаем флаг isLoading в false, т.к. процесс уже идет
        set({ isLoading: false });
    }
  },

  // Функция для выполнения логина пользователя
  login: async (email, password) => {
    set({ isLoading: true, error: null }); // Начинаем загрузку для процесса логина, сбрасываем предыдущие ошибки
    try {
      // Отправляем запрос на эндпоинт бэкенда /token для получения JWT токена.
      // Важно: эндпоинт /token ожидает данные в формате x-www-form-urlencoded (username и password),
      // а не JSON по умолчанию. Используем URLSearchParams для формирования данных и явно указываем Content-Type.
      const response = await api.post('/token', new URLSearchParams({ username: email, password: password }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, token_type } = response.data; // Получаем токен и его тип из ответа
      const token = access_token; // Сохраняем сам токен

      setAuthToken(token); // Устанавливаем полученный токен в заголовки Axios по умолчанию для всех последующих запросов к защищенным эндпоинтам

      // Получаем информацию о пользователе сразу после успешного получения токена.
      // Это необходимо, чтобы иметь актуальные данные пользователя (id, email, role, is_active).
      const userResponse = await api.get('/users/me');
      const user = userResponse.data; // Получаем данные пользователя из ответа

      // Сохраняем полученный токен и данные пользователя в Local Storage, чтобы они сохранялись между сессиями браузера.
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

      // Обновляем состояние стора с полученными данными.
      set({ token, user, isAuthenticated: true, isLoading: false, error: null }); // Сбрасываем ошибку

      return user; // Возвращаем данные пользователя из функции (может быть полезно в компоненте для перенаправления)

    } catch (error) {
      // Обработка ошибок при логине (например, неверные учетные данные, email не подтвержден)
      console.error("Login failed", error);
      setAuthToken(null); // В случае ошибки сбрасываем токен в Axios
      localStorage.removeItem(TOKEN_STORAGE_KEY); // Удаляем потенциально неверный или старый токен из Local Storage
      localStorage.removeItem(USER_STORAGE_KEY);
      // Извлекаем сообщение об ошибке из ответа бэкенда, если оно есть.
      const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials.";
      set({ token: null, user: null, isAuthenticated: false, isLoading: false, error: errorMessage }); // Обновляем состояние стора с ошибкой
      throw new Error(errorMessage); // Пробрасываем ошибку дальше, чтобы компонент мог ее обработать (например, показать сообщение пользователю)
    }
  },

  // Функция для выполнения логаута пользователя
  logout: () => {
    setAuthToken(null); // Сбрасываем токен в заголовках Axios
    localStorage.removeItem(TOKEN_STORAGE_KEY); // Удаляем токен из Local Storage
    localStorage.removeItem(USER_STORAGE_KEY); // Удаляем данные пользователя из Local Storage
    // Сбрасываем состояние стора в исходное неавторизованное состояние
    set({ token: null, user: null, isAuthenticated: false, isLoading: false, error: null }); // Сбрасываем ошибку
  },

  // Функция для обновления данных пользователя в сторе (например, после обновления профиля на бэкенде)
  setUser: (user) => {
     set({ user }); // Обновляем объект пользователя в сторе
     localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); // Обновляем данные пользователя в Local Storage
  },

  // Функция для регистрации нового пользователя
  registerUser: async (email, password, role) => {
     set({ isLoading: true, error: null }); // Начинаем загрузку (можно использовать отдельный флаг для регистрации), сбрасываем ошибку
     try {
        // Отправляем запрос на эндпоинт бэкенда /register с данными пользователя (email, password, role)
        // Axios по умолчанию отправит данные как JSON, что соответствует ожидаемому формату на бэкенде.
        const response = await api.post('/register', { email, password, role });
        const newUser = response.data; // Получаем данные только что зарегистрированного пользователя из ответа (включая is_active: false)

        // При успешной регистрации мы не авторизуем пользователя автоматически.
        // Пользователь должен будет подтвердить email и затем войти через форму логина.
        // Поэтому состояние аутентификации в сторе (token, user, isAuthenticated) не меняется.

        set({ isLoading: false, error: null }); // Завершаем загрузку, сбрасываем ошибки

        return newUser; // Возвращаем данные зарегистрированного пользователя (может быть полезно для компонента, чтобы показать ID или email)

     } catch (error) {
        // Обработка ошибок при регистрации (например, email уже занят)
        console.error('Registration failed', error);
        const errorMessage = error.response?.data?.detail || "Ошибка регистрации. Попробуйте еще раз.";
        set({ isLoading: false, error: errorMessage }); // Завершаем загрузку и устанавливаем ошибку в сторе
        throw new Error(errorMessage); // Пробрасываем ошибку дальше, чтобы компонент мог ее показать пользователю
     }
  }
}));

// Добавляем флаг isValidatingToken для контроля инициализации при hot-reload в development режиме
// Это необходимо, чтобы запрос api.get('/users/me') не выполнялся многократно
useAuthStore.setState({ isValidatingToken: false });


export default useAuthStore; // Экспортируем хук стора по умолчанию