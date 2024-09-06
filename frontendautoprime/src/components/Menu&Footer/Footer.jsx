import React from "react";

import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer_col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Marketplace</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Gallery</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer_col">
          <h4>Help</h4>
          <ul>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Order Status</a>
            </li>
            <li>
              <a href="#">Payments</a>
            </li>
          </ul>
        </div>
        <div className="footer_col">
          <h4>Marcas</h4>
          <ul>
            <li>
              <a href="#">BMW</a>
            </li>
            <li>
              <a href="#">Mercedes</a>
            </li>
            <li>
              <a href="#">Dodge</a>
            </li>
          </ul>
        </div>
        <div className="footer_col">
          <h4>Social Media</h4>

          <div className="social_links">
            <a className="whatsapp" href="">
              <i className="bx bxl-whatsapp"></i>
            </a>
            <a className="instagram" href="">
              <i className="bx bxl-instagram"></i>
            </a>
            <a className="facebook" href="">
              <i className="bx bxl-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
