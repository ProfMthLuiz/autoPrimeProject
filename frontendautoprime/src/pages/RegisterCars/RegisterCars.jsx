import React, { useState, useEffect } from "react";
import styles from "./RegisterCars.module.css";
import axios from "axios";
import ImagePreview from "../../components/ImagePreview/ImagePreview";

function RegisterCars() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("fotos", files[i]);
    }
    formData.append("marca", marca);
    formData.append("modelo", modelo);
    formData.append("ano", ano);
    formData.append("preco", preco);
    formData.append("descricao", descricao);

    try {
      const response = await axios.post(
        "http://localhost:3001/registerCars",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setSuccess("Carro cadastrado com sucesso!");
        setError(""); // Limpar erro
      }
    } catch (error) {
      console.error("Erro ao registrar carro: ", error);
      setError("Erro ao registrar carro.");
      setSuccess(""); // Limpar sucesso
    }
  };

  return (
    <section className={styles.containerRegister}>
      <h1>Adicionar Anúncios</h1>

      <form onSubmit={handleSubmit}>
        <section className={styles.addAnuncio}>
          <label>Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
          <label>Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          />
          <label>Ano:</label>
          <input
            type="number"
            id="ano"
            name="ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          />
          <label>Preço:</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
          <label>Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
          <label>Imagens:</label>
          <input
            type="file"
            id="imagens"
            name="imagens"
            multiple
            onChange={handleFileChange}
          />
          <ImagePreview
            imagePreviewContainer={styles.imagePreviewContainer}
            previewimg={styles.previewimg}
            files={files}
          />
          <button type="submit">Adicionar Anúncio</button>
          {error && <p>{error}</p>}
          {success && <p>{success}</p>}
        </section>
      </form>
    </section>
  );
}

export default RegisterCars;
