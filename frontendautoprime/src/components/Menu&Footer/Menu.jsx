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
        <NavLink to="/">
          <a style={{ "--i": 2 }} href="#">
            Home
          </a>
        </NavLink>
        <NavLink to="/registerCars">
          <a style={{ "--i": 2 }} href="#">
            Marketplace
          </a>
        </NavLink>
        <NavLink to="/contact">
          <a style={{ "--i": 2 }} href="#">
            Contato
          </a>
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
