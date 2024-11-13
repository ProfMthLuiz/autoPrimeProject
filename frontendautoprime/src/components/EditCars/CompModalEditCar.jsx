import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompModalEditCar.module.css"; // Importe os estilos específicos

const CompModalEditCar = ({ car, onClose, onSave }) => {
  const [marca, setMarca] = useState(car.marca);
  const [modelo, setModelo] = useState(car.modelo);
  const [ano, setAno] = useState(car.ano);
  const [preco, setPreco] = useState(car.preco);
  const [descricao, setDescricao] = useState(car.descricao);
  const [fotos, setFotos] = useState(car.fotos || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [fotosDisponiveis, setFotosDisponiveis] = useState([]);

  // Função para pegar o token diretamente do sessionStorage
  const getToken = () => sessionStorage.getItem("token");

  useEffect(() => {
    fetchFotosDisponiveis();
  }, []);

  const fetchFotosDisponiveis = async () => {
    try {
      const currentToken = getToken();
      const response = await axios.get("http://localhost:3001/photos/listar", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setFotosDisponiveis(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar fotos disponíveis:", error);
      setErrorMessage("Erro ao buscar fotos disponíveis");
    }
  };

  const handleSave = async () => {
    if (!marca || !modelo || !ano || !preco || !descricao) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const currentToken = getToken();
      await axios.put(
        `http://localhost:3001/cars/editCar/${car.id}`,
        {
          marca,
          modelo,
          ano,
          preco,
          descricao,
          fotos, // Enviando as fotos selecionadas
        },
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao editar carro:", error);
      setErrorMessage(error.response.data.message || "Erro ao editar carro");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Editar Carro</h2>

        <div className={styles.modalRow}>
          <label className={styles.modalCol}>
            Marca
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
            />
          </label>
          <label className={styles.modalCol}>
            Modelo
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </label>
        </div>

        <div className={styles.modalRow}>
          <label className={styles.modalCol}>
            Ano
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </label>
          <label className={styles.modalCol}>
            Preço
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              min="0"
              step="0.010"
              required
            />
          </label>
        </div>

        <label>
          Descrição
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </label>

        <label>
          Fotos:
          <select
            multiple
            value={fotos}
            onChange={(e) =>
              setFotos(
                [...e.target.selectedOptions].map((option) => option.value)
              )
            }
          >
            {fotosDisponiveis.map((foto) => (
              <option key={foto.id} value={foto.url}>
                {foto.nome}
              </option>
            ))}
          </select>
        </label>

        {errorMessage && (
          <p className={`${styles.message} ${styles.errorMessage}`}>
            {errorMessage}
          </p>
        )}

        <button onClick={handleSave}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default CompModalEditCar;
