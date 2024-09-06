import React, { useState } from "react";
import styles from "./RegisterCars.module.css";
import ImagePreview from "../../components/ImagePreview/ImagePreview";

function RegisterCars() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };
  return (
    <section className={styles.containerRegister}>
      <h1>Adicionar Anúncios</h1>

      <form id="adicionarAnuncioForm" enctype="multipart/form-data">
        <section className={styles.addAnuncio}>
          <label for="modelo">Modelo:</label>
          <input type="text" id="modelo" name="modelo" required />
          <label for="marca">Marca:</label>
          <input type="text" id="marca" name="marca" required />
          <label for="ano">Ano:</label>
          <input type="number" id="ano" name="ano" required />
          <label for="preco">Preço:</label>
          <input type="number" id="preco" name="preco" required />
          <label for="descricao">Descrição:</label>
          <textarea id="descricao" name="descricao" required></textarea>
          <label htmlFor="imagens">Imagens:</label>
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
        </section>
      </form>
    </section>
  );
}

export default RegisterCars;
