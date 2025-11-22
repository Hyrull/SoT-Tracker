import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import './global.scss'

import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Signup from "./pages/Signup/Signup.tsx"
import Login from "./pages/Login/Login.tsx"
import Settings from "./pages/Settings/Settings.tsx"
import Commendations from "./pages/Commendations/Commendations.tsx"
import ErrorPage from "./pages/ErrorPage/ErrorPage"
import { ToastProvider } from "./contexts/ToastContext.tsx"
import { UserProvider } from './contexts/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <ToastProvider>
  <UserProvider>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/settings' element={<Settings />} />'
      <Route path='/commendations' element={<Commendations />} />
      <Route path='*' element={<ErrorPage />} /> 
    </Routes>
    <Footer />
  </UserProvider>
  </ToastProvider>
  </BrowserRouter>
)