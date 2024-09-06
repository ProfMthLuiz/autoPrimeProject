import React from "react";

import imgMarketplace from "../../assets/images/dodge.jpg";
import "./Home.css";

function Home() {
  return (
    <section className="imgback">
      <div className="opacity">
        <section className="Titulo"></section>
        <section className="curiosidades">
          <h2>Curiosidades</h2>
          <div className="cards">
            <div className="card">
              <div className="card_inner">
                <div className="card_front">
                  <img src={imgMarketplace} alt="" />
                </div>
                <div className="card_back">
                  <h2>Dodge</h2>
                  <a
                    href="./pages/marketplace.html"
                    className="introducaocarro"
                  >
                    Os carros Dodge são conhecidos por sua audaciosa potência e
                    estilo agressivo, oferecendo uma combinação emocionante de
                    desempenho robusto e design imponente.
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card_inner">
                <div className="card_front">
                  <img src={imgMarketplace} alt="" />
                </div>
                <div className="card_back">
                  <h2>Ford GT</h2>
                  <a
                    href="./pages/marketplace.html"
                    className="introducaocarro"
                  >
                    O Ford GT é um ícone de engenharia automotiva, projetado
                    para proporcionar uma performance extrema com um design que
                    homenageia a sua rica herança de corridas.
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card_inner">
                <div className="card_front">
                  <img src={imgMarketplace} alt="" />
                </div>
                <div className="card_back">
                  <h2>Ferrari F430</h2>
                  <a
                    href="./pages/marketplace.html"
                    className="introducaocarro"
                  >
                    O Ferrari F430 é a combinação perfeita de elegância e
                    desempenho, oferecendo uma experiência de condução intensa e
                    emocionante.
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card_inner">
                <div className="card_front">
                  <img src={imgMarketplace} alt="" />
                </div>
                <div className="card_back">
                  <h2>Porsche 911</h2>
                  <a
                    href="./pages/marketplace.html"
                    className="introducaocarro"
                  >
                    O Porsche 911 GT3 é uma obra-prima de precisão e desempenho,
                    oferecendo uma experiência de condução pura com sua
                    engenharia refinada e um motor de alta performance.
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card_inner">
                <div className="card_front">
                  <img src={imgMarketplace} alt="" />
                </div>
                <div className="card_back">
                  <h2>Mercedes AMG</h2>
                  <a
                    href="./pages/marketplace.html"
                    className="introducaocarro"
                  >
                    Os modelos Mercedes-AMG são a expressão máxima de luxo e
                    potência, combinando engenharia avançada com desempenho
                    extremo para uma experiência de condução incomparável.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/9ngLVS85hO8?si=I1R2GOhlDiAMZ-hu&amp;start=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="carousel-item">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/DZAdVY9kKbc?si=QK2K1kDGvgCDxj7f"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="carousel-item">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/FYtEjSuYhPo?si=rpqUEP0NWkL8lO0i&amp;start=55"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="carousel-item">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/2M4PbAMixls"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="carousel-item">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/P0Co_CvA58U"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <a className="carousel-control prev" href="#">
            &#10094;
          </a>
          <a className="carousel-control next" href="#">
            &#10095;
          </a>
        </div>
      </div>
    </section>
  );
}

export default Home;
