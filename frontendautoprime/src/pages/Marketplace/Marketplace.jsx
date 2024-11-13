import React, { useState, useEffect, useCallback } from "react";
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
    precoMin: 0,
    busca: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPriceCalled, setMaxPriceCalled] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

  useEffect(() => {
    // Sempre que os filtros ou a página mudarem, buscamos os carros
    fetchCarros();
  }, [filtros, page]); // Isso garante que a API seja chamada corretamente ao alterar filtros ou a página

  useEffect(() => {
    if (carros.length > 0) {
      if (!maxPriceCalled) {
        highestPrice();
        lowestPrice();
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
        precoMin: filtros.precoMin,
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
    setMinPrice(min);
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      precoMin: min,
    }));
  };

  const handleCheckboxChange = (e, filterKey) => {
    const { value, checked } = e.target;

    setFiltros((prevFiltros) => {
      const updatedFilterValues = checked
        ? [...prevFiltros[filterKey], value]
        : prevFiltros[filterKey].filter((item) => item !== value);

      return {
        ...prevFiltros,
        [filterKey]: updatedFilterValues,
      };
    });

    setPage(1);
  };

  const handleRangeChange = (e) => {
    // Atualiza o preço sem chamar imediatamente o fetch
    const precoMaxValue = e.target.value;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      precoMax: precoMaxValue,
    }));
  };

  const fetchAutoComplete = async (value) => {
    // Não realizar a busca se a string for menor que 3 caracteres
    if (value.length < 0) {
      setAutoCompleteOptions([]);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/cars/autoComplete",
        {
          params: { query: value },
        }
      );

      const options = response.data.suggestions.map((item) => ({
        value: item.value,
      }));

      setAutoCompleteOptions(options);
    } catch (error) {
      console.error("Erro ao buscar sugestões de autocomplete:", error);
    }
  };

  // Debounce para otimizar as chamadas de autocomplete
  const debouncedFetchAutoComplete = useCallback(
    debounce((value) => {
      fetchAutoComplete(value);
    }, 300),
    []
  );

  // Debounce para otimizar as chamadas de autocomplete
  const debouncedFetchAutoCarros = useCallback(
    debounce((value) => {
      handleRangeChange(value);
    }, 300),
    []
  );

  const onSelect = (value) => {
    setFiltros((prev) => ({
      ...prev,
      busca: value,
      modelo: [value],
    }));
    setPage(1);
  };

  const onSearchChange = (value) => {
    // Se a busca estiver vazia, reseta todos os filtros
    setFiltros((prev) => ({
      ...prev,
      busca: value,
      ...(value === "" && {
        marca: [],
        modelo: [],
        ano: [],
        precoMax: "",
        precoMin: 0,
      }),
    }));
    setPage(1);

    // Chama o debounced fetch de autocomplete
    if (value.length >= 1) {
      debouncedFetchAutoComplete(value);
    } else {
      setAutoCompleteOptions([]); // Limpar opções se menos de 3 caracteres
    }
  };

  return (
    <section className={styles.marketplace}>
      <div className={styles.search}>
        <div className={styles.search_box}>
          <AutoComplete
            options={autoCompleteOptions}
            onSearch={onSearchChange}
            onSelect={onSelect}
            style={{ width: "100%" }}
            placeholder=""
            allowClear
          >
            <Input prefix={<SearchOutlined />} name="search_txt" />
          </AutoComplete>
        </div>
      </div>

      <div className={styles.areaproducts}>
        <aside className={styles.filtros}>
          <form id="filtroForm">
            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Marca</h2>
              {marcas.map((marca) => (
                <label key={marca} className={styles.custom_checkbox}>
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
              {modelos.map((modelo) => (
                <label key={modelo} className={styles.custom_checkbox}>
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
              {anos.map((ano) => (
                <label key={ano} className={styles.custom_checkbox}>
                  <input
                    type="checkbox"
                    value={ano.toString()}
                    onChange={(e) => handleCheckboxChange(e, "ano")}
                    checked={filtros.ano.includes(ano.toString())}
                  />
                  <span className={styles.checkmark}></span>
                  {ano}
                </label>
              ))}
            </div>
            <div className={styles.filtro_item}>
              <h2 className={styles.title}>Preço</h2>
              <div className={styles.price}>
                <input
                  className={styles.price_range}
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="100"
                  value={filtros.precoMax || maxPrice}
                  onChange={handleRangeChange}
                />
                <span>
                  <strong>R${filtros.precoMax || maxPrice}</strong>
                </span>
              </div>
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
                        carro.imagens && JSON.parse(carro.imagens).length > 0
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
