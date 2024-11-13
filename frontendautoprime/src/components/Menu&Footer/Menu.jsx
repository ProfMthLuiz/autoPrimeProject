import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./Menu.css";
import "boxicons/css/boxicons.min.css";

function Menu({ isLoggedIn, setIsLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken"); // Remove o token do sessionStorage
    sessionStorage.removeItem("refreshToken"); // Remove o refreshToken
    setIsLoggedIn(false); // Atualiza o estado de login
    navigate("/"); // Redireciona para a página inicial após o logout
  };

  return (
    <header className="header">
      <a href="/" className="logo"></a>
      <input type="checkbox" id="check" />
      <label htmlFor="check" className="icons">
        <i className="bx bx-menu" id="menuIcon"></i>
        <i className="bx bx-x" id="closeIcon"></i>
      </label>
      <nav className="navbar">
        <NavLink to="/" style={{ "--i": 2 }}>
          Home
        </NavLink>
        <NavLink to="/marketplace" style={{ "--i": 2 }}>
          Marketplace
        </NavLink>
        <NavLink to="/contact" style={{ "--i": 2 }}>
          Contato
        </NavLink>

        {isLoggedIn ? (
          <div
            className="user-icon"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <UserOutlined />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <a href="#" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" style={{ "--i": 2 }}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Menu;
