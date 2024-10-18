import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import imgLogoLogin from "../../assets/images/logo.jfif";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook do React Router

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setError("");

        // Armazena o accessToken e refreshToken no sessionStorage
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);

        // Redireciona para o dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
        setSuccess("");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  return (
    <section className={styles.containerLogin}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={imgLogoLogin} alt="AutoPrime Logo" />
        </div>
        <h1>Bem-vindo ao AutoPrime</h1>
        <div className={styles.login_box}>
          <h2>LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              value={password}
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input type="submit" value="LOGIN" />
            <div className={styles.forgot_password}>
              <a href="/recuperarSenha">Esqueci minha senha</a>
            </div>
          </form>
          {success && <div className={styles.success}>{success}</div>}
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </section>
  );
}

export default Login;
