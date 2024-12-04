import React, { useContext } from "react";
import styles from "./CartItem.module.css";
import { FaTrash } from "react-icons/fa6";
import AppContext from "../../context/AppContext";

const CartItem = ({ data }) => {
  const { cartItems, setCartItems, setAviso, aviso } = useContext(AppContext);

  console.log(data);

  const handleIncreaseQuantity = () => {
    if (data.quantidade >= 10) {
      // Mostrar mensagem ao usuário
      setAviso("Quantidade máxima em estoque atingida!");
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id_cars === data.id_cars // Usar o identificador correto
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = () => {
    if (data.quantidade <= 1) {
      // Mostrar mensagem ao usuário
      setAviso("Quantidade mínima permitida é 1!");
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id_cars === data.id_cars // Usar o identificador correto
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = () => {
    setCartItems(
      (prevItems) => prevItems.filter((item) => item.id_cars !== data.id_cars) // Usar o identificador correto
    );
  };

  return (
    <section className={styles.cart_item}>
      <img
        src={`http://localhost:3001/uploads/${JSON.parse(data.imagens)[0]}`}
        alt="Imagem do Produto"
        className={styles.cart_item_image}
      />
      <div className={styles.cart_item_content}>
        <h3 className={styles.cart_item_title}>{data.nome}</h3>
        <h3 className={styles.cart_item_price}>R${data.preco}</h3>
        <div className={styles.cart_item_quantity}>
          <button type="button" onClick={handleDecreaseQuantity}>
            -
          </button>
          <span className={styles.cart_quantity}>{data.quantidade}</span>
          <button type="button" onClick={handleIncreaseQuantity}>
            +
          </button>
        </div>
      </div>
      <button
        type="button"
        className={styles.cart_item_remove}
        onClick={handleRemoveItem}
      >
        <FaTrash />
      </button>
    </section>
  );
};

export default CartItem;
