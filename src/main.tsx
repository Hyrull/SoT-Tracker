import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import './global.scss'

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup.tsx";
import Login from "./pages/Login/Login.tsx";
import Commendations from "./pages/Commendations/Commendations.tsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/Sot-Tracker' element={<Home />} />
      <Route path='/Sot-Tracker/signup' element={<Signup />} />
      <Route path='/Sot-Tracker/login' element={<Login />} />
      <Route path='/SoT-Tracker/commendations' element={<Commendations />} />
      <Route path='*' element={<ErrorPage />} /> 
    </Routes>
    <Footer />
  </BrowserRouter>
);