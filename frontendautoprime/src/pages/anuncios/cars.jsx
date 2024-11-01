// Anuncios.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cars() {
  const [anuncios, setAnuncios] = useState([]);

  const fetchAnuncios = async () => {
    try {
      const response = await axios.get("http://10.144.170.37:3001/anuncios");
      setAnuncios(response.data);
      console.log(anuncios);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
    }
  };

  // useEffect para buscar dados ao montar o componente
  useEffect(() => {
    fetchAnuncios();
  }, []);

  return (
    <div className="anuncios-container">
      <h1>{anuncios.preço}</h1>
    </div>
  );
}
