import React, { useState } from "react";
import styles from "./RegisterUser.module.css";
import imgRegisterUser from "../../assets/images/imgBackgroundCadastro.jpg";

function RegisterUser() {
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");

  const handlePhoneChange = (event) => {
    let value = event.target.value;
    setPhone(phoneMask(value));
  };

  const handleCpfChange = (event) => {
    let value = event.target.value;
    setCpf(cpfMask(value));
  };

  const handleRgChange = (event) => {
    let value = event.target.value.toUpperCase(); // Força maiúsculas
    if (value[value.length - 1] === "X") {
      setRg(value); // Permite "X" no final
    } else {
      setRg(rgMask(value));
    }
  };

  const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    value = value.replace(/(\d{2})(\d)/, "($1) $2"); // Adiciona o parênteses em volta do DDD
    value = value.replace(/(\d)(\d{4})$/, "$1-$2"); // Adiciona o hífen antes dos últimos 4 dígitos
    return value;
  };

  const cpfMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const rgMask = (value) => {
    if (!value) return "";

    value = value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

    if (value.length > 8 && value.length <= 9) {
      // Se o RG tiver 9 dígitos, adiciona um "X" opcional no final
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
    } else {
      // Formatação normal sem "X"
      value = value.replace(/(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
    }

    return value;
  };

  return (
    <section className={styles.containerRegister}>
      <div className={styles.container}>
        <div className={styles.left_section}>
          <img src={imgRegisterUser} alt="GOLF GTI" />
        </div>
        <div className={styles.right_section}>
          <h2>FACA SEU CADASTRO!</h2>
          <form>
            <div className={styles.input_group}>
              <label htmlFor="primeiroNome">PRIMEIRO NOME</label>
              <input
                type="text"
                id="primeiroNome"
                placeholder="Digite seu primeiro nome"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="sobrenome">SOBRENOME</label>
              <input
                type="text"
                id="sobrenome"
                placeholder="Digite seu sobrenome"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="email">E-MAIL</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="celular">CELULAR</label>
              <input
                type="tel"
                value={phone}
                id="celular"
                placeholder="(XX) XXXXX-XXXX"
                onChange={handlePhoneChange}
                maxLength="15"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                value={cpf}
                id="cpf"
                onChange={handleCpfChange}
                placeholder="XXX.XXX.XXX-XX"
                maxLength="14" // Limite de caracteres para RG
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="rg">RG:</label>
              <input
                type="text"
                id="rg"
                value={rg}
                onChange={handleRgChange}
                placeholder="XX.XXX.XXX-X"
                maxLength="12" // Limite de caracteres para RG
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="senha">SENHA</label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="confirmarSenha">CONFIRME SUA SENHA</label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Digite sua senha novamente"
                required
              />
            </div>
            <button type="submit" href="../index.html">
              CADASTRAR!
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterUser;
