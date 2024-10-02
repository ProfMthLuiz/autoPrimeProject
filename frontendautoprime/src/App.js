import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Menu from "./components/Menu&Footer/Menu";
import Footer from "./components/Menu&Footer/Footer";
import Login from "./pages/Login/Login";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";
import RegisterCars from "./pages/RegisterCars/RegisterCars";
import RegisterUser from "./pages/RegisterUser/RegisterUser";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/registerCars" element={<RegisterCars />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;