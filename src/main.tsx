import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import BoardContextProvider from './context/boardContext'
import './style/global.scss'
import AuthContextProvider from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <BoardContextProvider>
      <App />
    </BoardContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>,
)
