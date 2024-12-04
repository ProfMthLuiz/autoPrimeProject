import React, { useState } from "react";
import AppContext from "./AppContext";

const Provider = ({ children }) => {
  const [aviso, setAviso] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const value = {
    cartItems,
    setCartItems,
    isCartVisible,
    setIsCartVisible,
    aviso,
    setAviso,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default Provider;
