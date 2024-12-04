import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import './global.scss'

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Commendations from "./pages/Commendations/Commendations";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/commendations' element={<Commendations />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);