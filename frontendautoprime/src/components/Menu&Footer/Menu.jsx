import React from "react";

import "./Menu.css";
import "boxicons/css/boxicons.min.css"; // Importa os estilos dos ícones

function Menu() {
  return (
    <header className="header">
      {/* Seção de cabeçalho, geralmente contém o logo e a navegação principal */}
      <a href="/" className="logo"></a>
      {/* Um link que representa o logotipo da página. O atributo "href" está vazio,
      então não leva a lugar nenhum */}
      <input type="checkbox" id="check" />
      {/* Um checkbox que provavelmente é usado para ativar/desativar um menu móvel */}
      <label htmlFor="check" className="icons">
        {/* Um rótulo que controla o checkbox. O atributo "for" está associado ao ID
        do checkbox */}
        <i className="bx bx-menu" id="menuIcon"></i>
        {/* Um ícone de menu fornecido pela biblioteca Boxicons, visível quando o
        menu está fechado */}
        <i className="bx bx-x" id="closeIcon"></i>
        {/* Um ícone de fechar fornecido pela biblioteca Boxicons, visível quando o
        menu está aberto */}
      </label>
      <nav className="navbar">
        <a style={{ "--i": 1 }} href="/">
          Home
        </a>
        <a style={{ "--i": 2 }} href="#">
          Marketplace
        </a>
        <a style={{ "--i": 3 }} href="#">
          About
        </a>
        <a style={{ "--i": 4 }} href="#">
          Contact
        </a>
        <a style={{ "--i": 5 }} href="#">
          Cadastro
        </a>
      </nav>
    </header>
  );
}

export default Menu;
