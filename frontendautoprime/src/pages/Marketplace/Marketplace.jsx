import React, { useState, useEffect } from "react";
import styles from "./Marketplace.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import axios from "axios";
import debounce from "lodash.debounce";

const Marketplace = () => {
  const [carros, setCarros] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    marca: [],
    modelo: [],
    ano: [],
    precoMax: "",
    precoMin: 0, // Inicializado com 0, mas vamos atualizar isso mais tarde.
    busca: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minPrice, setMinPrice] = useState(0); // Estado para o menor valor de preço.
  const [maxPriceCalled, setMaxPriceCalled] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

  useEffect(() => {
    fetchCarros();
    // console.log(JSON.parse(carros[3].imagens)[0]);
    // console.log(typeof JSON.parse(carros[3].imagens));
  }, [filtros, page]);

  useEffect(() => {
    if (carros.length > 0) {
      if (!maxPriceCalled) {
        highestPrice();
        lowestPrice(); // Calcular o menor preço
        setMaxPriceCalled(true);
      }
      extractAttributes(carros);
    }
  }, [carros, maxPriceCalled]);

  const fetchCarros = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        marca: filtros.marca,
        modelo: filtros.modelo,
        ano: filtros.ano,
        precoMax: filtros.precoMax,
        precoMin: filtros.precoMin, // Passando o preço mínimo para o backend
        busca: filtros.busca,
      };

      const response = await axios.get("http://localhost:3001/cars/catalogo", {
        params,
      });
      setCarros(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractAttributes = (carros) => {
    const marcasUnicas = [...new Set(carros.map((carro) => carro.marca))];
    const modelosUnicos = [...new Set(carros.map((carro) => carro.modelo))];
    const anosUnicos = [...new Set(carros.map((carro) => carro.ano))];

    setMarcas(marcasUnicas);
    setModelos(modelosUnicos);
    setAnos(anosUnicos);
  };

  const highestPrice = () => {
    const max = Math.max(...carros.map((carro) => carro.preco));
    setMaxPrice(max);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      precoMax: max,
    }));
  };

  const lowestPrice = () => {
    const min = Math.min(...carros.map((carro) => carro.preco));
    setMinPrice(min); // Atualiza o valor mínimo do preço
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      precoMin: min, // Atualiza o filtro com o valor mínimo
    }));
  };

  const handleCheckboxChange = (e, filterKey) => {
    const { value, checked } = e.target;

    // Certifique-se de que o valor do filtro de ano é convertido para inteiro
    const newValue = filterKey === "ano" ? parseInt(value, 10) : value;

    setFiltros((prevFiltros) => {
      const updatedFilterValues = checked
        ? [...prevFiltros[filterKey], newValue]
        : prevFiltros[filterKey].filter((item) => item !== newValue);

      return {
        ...prevFiltros,
        [filterKey]: updatedFilterValues,
      };
    });

    setPage(1);
  };

  const handleSearchChange = debounce(async (value) => {
    setFiltros((prevFiltros) => ({ ...prevFiltros, busca: value }));
    try {
      const response = await axios.get("http://localhost:3001/cars/search", {
        params: { busca: value },
      });
      setAutoCompleteOptions(
        response.data.map((carro) => ({
          value: carro.nome,
          label: carro.nome,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  }, 300);

  return (
    <section className={styles.marketplace}>
      <div className={styles.search}>
        <div className={styles.search_box}>
          <AutoComplete
            options={autoCompleteOptions}
            onSearch={handleSearchChange}
            style={{ width: "100%" }}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Buscar por nome, modelo ou ano"
            />
          </AutoComplete>
        </div>
      </div>

      <div className={styles.areaproducts}>
        <aside className={styles.filtros}>
          <form id="filtroForm">
            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Marca</h2>
              {marcas.map((marca, index) => (
                <label key={index} className={styles.custom_checkbox}>
                  <input
                    type="checkbox"
                    value={marca}
                    onChange={(e) => handleCheckboxChange(e, "marca")}
                    checked={filtros.marca.includes(marca)}
                  />
                  <span className={styles.checkmark}></span>
                  {marca}
                </label>
              ))}
            </div>
            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Modelo</h2>
              {modelos.map((modelo, index) => (
                <label key={index} className={styles.custom_checkbox}>
                  <input
                    type="checkbox"
                    value={modelo}
                    onChange={(e) => handleCheckboxChange(e, "modelo")}
                    checked={filtros.modelo.includes(modelo)}
                  />
                  <span className={styles.checkmark}></span>
                  {modelo}
                </label>
              ))}
            </div>
            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Ano</h2>
              {anos.map((ano, index) => (
                <label key={index} className={styles.custom_checkbox}>
                  <input
                    type="checkbox"
                    value={ano.toString()} // Certifique-se de passar como string ou int, conforme o caso
                    onChange={(e) => handleCheckboxChange(e, "ano")}
                    checked={filtros.ano.includes(ano)}
                  />
                  <span className={styles.checkmark}></span>
                  {ano}
                </label>
              ))}
            </div>

            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Preço</h2>
              <input
                type="range"
                min={minPrice} // Usando o menor preço encontrado
                max={maxPrice}
                value={filtros.precoMax}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    precoMax: e.target.value,
                  }))
                }
              />
              <span>{filtros.precoMax}</span>
            </div>
          </form>
        </aside>

        <div className={styles.produtos}>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.container}>
              {carros.map((carro) => (
                <div key={carro.id} className={styles.card}>
                  <div className={styles.imgBx}>
                    <img
                      src={
                        carro.imagens && carro.imagens.length > 0
                          ? `http://localhost:3001/uploads/${
                              JSON.parse(carro.imagens)[0]
                            }`
                          : "/path/to/default/image.jpg"
                      }
                      alt={carro.modelo}
                    />
                  </div>
                  <div className={styles.contentBx}>
                    <h2>{carro.modelo}</h2>
                    <a href="#">Comprar Agora</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.paginacao}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;

{
  /* <div key={carro.id} className={styles.card}>
<div className={styles.imgBx}>
  <img
    src={
      carro.imagens && carro.imagens.length > 0
        ? `http://localhost:3001/uploads/${
            JSON.parse(carro[0].imagens)[0]
          }`
        : "/path/to/default/image.jpg"
    }
    alt={carro.modelo}
  />
</div>
<div className={styles.contentBx}>
  <h2>{carro.modelo}</h2>
  <a href="#">Comprar Agora</a>
</div>
</div> */
}
