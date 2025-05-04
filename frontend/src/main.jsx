// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from '@mui/material/styles';
import App from './App'

// Импортируем стили
import './index.css' // Tailwind CSS
import './index.scss' // SCSS стили

// Импортируем тему MUI
import muiTheme from './theme/index'

// Используйте здесь ваш реальный Client ID из Google Console
const GOOGLE_CLIENT_ID = "735617581412-e8ceb269bj7qqrv9sl066q63g5dr5sne.apps.googleusercontent.com"

// Точка входа в приложение
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={muiTheme}>
          <NextUIProvider>
            <App />
          </NextUIProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)