// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Импортируем стили (SASS)
import './index.scss'

// Импортируем компоненты для роутинга
import { BrowserRouter } from 'react-router-dom'

// Импортируем ThemeProvider из Material UI для применения темы
import { ThemeProvider } from '@mui/material/styles';
// Импортируем нашу тему, определенную в src/theme/index.js
import theme from './theme';
// Импортируем CssBaseline из Material UI для сброса стандартных стилей браузера
import CssBaseline from '@mui/material/CssBaseline';


// Точка входа в приложение. Рендерим корневой компонент App в элемент с id 'root' в index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode - вспомогательный компонент для выявления потенциальных проблем в приложении во время разработки.
  <React.StrictMode>
    {/* ThemeProvider применяет нашу MUI тему ко всему приложению */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline сбрасывает базовые стили браузера (margin, padding) и применяет базовые стили из темы. */}
      <CssBaseline />
      {/* BrowserRouter обеспечивает функциональность роутинга, используя историю браузера. */}
      {/* Все компоненты, использующие хуки роутера (useNavigate, useLocation и т.д.) или компоненты типа Link, Route, Routes, должны быть внутри BrowserRouter. */}
      <BrowserRouter>
        {/* Основной компонент приложения */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)