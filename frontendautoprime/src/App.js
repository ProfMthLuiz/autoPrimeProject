import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Menu from "./components/Menu&Footer/Menu";
import Footer from "./components/Menu&Footer/Footer";
import Login from "./pages/Login/Login";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";
import RegisterCars from "./pages/RegisterCars/RegisterCars";
import RegisterUser from "./pages/RegisterUser/RegisterUser";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Contato from "./pages/contato/Contato";
import Marketplace from "./pages/Marketplace/Marketplace";
import React, { useState, useEffect } from "react";
import Provider from "./context/Provider";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se o token de acesso está armazenado no sessionStorage
    const token = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Atualiza o estado de login
  }, []);

  return (
    <Provider>
      <Router>
        <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/registerCars" element={<RegisterCars />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contato />} />
          <Route path="/cart" element={<ShoppingCart />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
