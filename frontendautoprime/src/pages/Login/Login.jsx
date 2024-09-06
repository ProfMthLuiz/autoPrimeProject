import React from "react";
import styles from "./Login.module.css";
import imgLogoLogin from "../../assets/images/logo.jfif";

function Login() {
  return (
    <section className={styles.containerLogin}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={imgLogoLogin} alt="AutoPrime Logo" />
        </div>
        <h1>Bem-vindo ao AutoPrime</h1>
        <div className={styles.login_box}>
          <h2>LOGIN</h2>
          <form>
            <input
              type="text"
              placeholder="Usuário"
              required
              aria-label="Usuário"
            />
            <input
              type="password"
              placeholder="Senha"
              required
              aria-label="Senha"
            />
            <input type="submit" value="LOGIN" />
            <div className={styles.forgot_password}>
              <a href="/recuperarSenha">Esqueci minha senha</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
