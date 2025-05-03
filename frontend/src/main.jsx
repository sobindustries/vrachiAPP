import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss' // или './index.scss' если будешь использовать sass для общих стилей
import { BrowserRouter } from 'react-router-dom' // Импортируем BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Оборачиваем приложение в BrowserRouter для работы с роутами */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)