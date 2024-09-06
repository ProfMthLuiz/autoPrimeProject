import React from "react";
import styles from "./RecuperarSenha.module.css";
import imgLogoLogin from "../../assets/images/logo.jfif";

function RecuperarSenha() {
  return (
    <section className={styles.containerRecSenha}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={imgLogoLogin} alt="AutoPrime Logo" />
        </div>
        <h1>Recuperação de Senha</h1>
        <div className={styles.recovery_box}>
          <h2>Recuperar Senha</h2>
          <form>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              required
              aria-label="E-mail"
            />
            <input type="submit" value="Enviar Instruções" />
            <div className={styles.back_to_login}>
              <a href="/login">Voltar ao Login</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RecuperarSenha;
