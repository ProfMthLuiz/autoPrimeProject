import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "./Menu.css";
import "boxicons/css/boxicons.min.css";

function Menu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
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
        {/* Remove as tags <a> aninhadas dentro de NavLink */}
        <NavLink to="/" style={{ "--i": 2 }}>
          Home
        </NavLink>
        <NavLink to="/registerCars" style={{ "--i": 2 }}>
          Marketplace
        </NavLink>
        <NavLink to="/contact" style={{ "--i": 2 }}>
          Contato
        </NavLink>

        <div
          className="user-icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <UserOutlined />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <NavLink to="/profile">Perfil</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/logout">Logout</NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Menu;
