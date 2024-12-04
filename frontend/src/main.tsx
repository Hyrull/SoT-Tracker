import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}/>
    </Routes>
    <Footer />
  </BrowserRouter>
);