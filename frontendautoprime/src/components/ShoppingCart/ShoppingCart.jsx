import React, { useContext, useEffect } from "react";

import styles from "./ShoppingCart.module.css";
import CartItem from "../CartItem/CartItem";
import AppContext from "../../context/AppContext";

const ShoppingCart = () => {
  const { cartItems, isCartVisible, aviso, setAviso } = useContext(AppContext);
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.quantidade * parseFloat(item.preco);
  }, 0);

  useEffect(() => {
    if (aviso) {
      const timer = setTimeout(() => {
        setAviso("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [aviso]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <main>
      <section
        className={`${styles.cart} ${isCartVisible ? styles.cart_active : ""}`}
      >
        <div className={styles.cart_items}>
          {cartItems.map((cartItem) => (
            <CartItem key={cartItem.id} data={cartItem} />
          ))}
        </div>
        <div className={styles.cart_resume}>
          {aviso && <p className={styles.aviso}>{aviso}</p>}
          <p className={styles.totalPrice}>
            Valor total: <p>{formatCurrency(totalPrice)}</p>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ShoppingCart;
