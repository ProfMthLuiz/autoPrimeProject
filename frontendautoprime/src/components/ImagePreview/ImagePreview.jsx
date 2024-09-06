// ImagePreview.js
import React from "react";

const ImagePreview = ({ imagePreviewContainer, previewimg, files }) => {
  return (
    <div className={imagePreviewContainer} id="imagePreviewContainer">
      {files.map((file, index) => (
        <img
          key={index}
          src={URL.createObjectURL(file)}
          alt={`Imagem ${index + 1}`}
          className={previewimg} // Adiciona uma classe para estilizar as imagens
          style={{ objectFit: "cover" }}
        />
      ))}
    </div>
  );
};

export default ImagePreview;
