import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiSolidTrash, BiPencil } from "react-icons/bi";
import styles from "./CompListCars.module.css";
import Pagination from "../Pagination/Pagination";
import CompModalEditCar from "../EditCars/CompModalEditCar"; // Modal para editar carro

const CompListCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Função para pegar o token diretamente do sessionStorage
  const getToken = () => sessionStorage.getItem("accessToken");

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const fetchCars = async (page = 1) => {
    try {
      const currentToken = getToken();

      const response = await axios.get(
        `http://localhost:3001/cars/catalogo`, // Endereço da API de carros
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setCars(response.data.results);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken(); // Utilize a função getToken para pegar o token do sessionStorage

      if (!token) {
        console.error("Token não encontrado.");
        return;
      }

      // Faz a requisição de exclusão com o token JWT no cabeçalho
      const response = await axios.delete(`http://localhost:3001/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Inclua o token no formato 'Bearer <token>'
        },
      });

      console.log("Carro excluído com sucesso:", response.data);
      // Atualize a lista de carros após a exclusão, se necessário
      fetchCars(currentPage); // Atualizar a lista de carros após a exclusão
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
    }
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Fechar o modal
    setSelectedCar(null); // Limpar o carro selecionado
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchCars(pageNumber);
  };

  return (
    <section className={styles.tableCars}>
      <table className={styles.content_table}>
        <thead>
          <tr>
            <td>ID</td>
            <td>Modelo</td>
            <td>Marca</td>
            <td>Ano</td>
            <td>Preço</td>
            <td>Descrição</td>
            <td>Editar</td>
            <td>Excluir</td>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id_cars}>
              <td data-label="ID">{car.id_cars}</td>
              <td data-label="Modelo">{car.modelo}</td>
              <td data-label="Marca">{car.marca}</td>
              <td data-label="Ano">{car.ano}</td>
              <td data-label="Preço">{car.preco}</td>
              <td data-label="Descrição">{car.descricao}</td>
              <td data-label="Editar">
                <button
                  className={styles.btnEdit}
                  onClick={() => handleEdit(car)}
                >
                  <BiPencil />
                </button>
              </td>
              <td
                data-label="Excluir"
                onClick={() => handleDelete(car.id_cars)}
              >
                <button className={styles.btnDelete}>
                  <BiSolidTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && selectedCar && (
        <CompModalEditCar
          car={selectedCar}
          onClose={handleCloseModal}
          onSave={fetchCars}
        />
      )}
    </section>
  );
};

export default CompListCars;
