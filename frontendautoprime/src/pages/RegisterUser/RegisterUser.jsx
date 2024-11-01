import React, { useState } from "react";
import axios from "axios"; // Não esqueça de importar o axios
import styles from "./RegisterUser.module.css";
import imgRegisterUser from "../../assets/images/imgBackgroundCadastro.jpg";

function RegisterUser() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    alert("HANDLE SUBMIT!");
    // Verifica se a senha e a confirmação da senha são iguais
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      setError("As senhas não coincidem.");
      setSuccess(""); // Limpar mensagem de sucesso
      return; // Interrompe a execução da função
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/registerUser",
        {
          nome,
          sobrenome,
          email,
          senha,
          phone,
          cpf,
          rg,
          cep,
          rua,
          numero,
          bairro,
          cidade,
        },
        {
          headers: {
            "Content-Type": "application/json", // Definir o tipo de conteúdo como JSON
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Usuário cadastrado com sucesso!");
        setError(""); // Limpar erro
      }
    } catch (error) {
      console.error("Erro ao registrar usuário: ", error);
      setError("Erro ao registrar usuário.");
      setSuccess(""); // Limpar sucesso
    }
  };

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

  const handleCepChange = async (event) => {
    let value = event.target.value;
    setCep(cepMask(value));

    // Verifica se o CEP está completo
    if (value.length === 9) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${value}/json/`
        );
        console.log("Response: ", response);
        if (!response.data.erro) {
          alert("OLA4");
          // Atualiza os campos com os dados do CEP
          setRua(response.data.logradouro);
          setBairro(response.data.bairro);
          setCidade(response.data.localidade);

          if (cidade) {
            alert(cidade);
          }
        } else {
          setError("CEP não encontrado.");
          setRua("");
          setBairro("");
          setCidade("");
        }
      } catch (error) {
        setError("Erro ao buscar o CEP.");
        console.error("Erro ao buscar o CEP: ", error);
        setRua("");
        setBairro("");
        setCidade("");
      }
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

  const cepMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Adiciona o hífen após os 5 primeiros dígitos
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
          <form onSubmit={handleSubmit}>
            <div className={styles.input_group}>
              <label htmlFor="primeiroNome">PRIMEIRO NOME</label>
              <input
                type="text"
                value={nome}
                id="primeiroNome"
                placeholder="Digite seu primeiro nome"
                onChange={(e) => setNome(e.target.value)} // Correção aqui
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="sobrenome">SOBRENOME</label>
              <input
                type="text"
                value={sobrenome}
                id="sobrenome"
                placeholder="Digite seu sobrenome"
                onChange={(e) => setSobrenome(e.target.value)} // Correção aqui
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="email">E-MAIL</label>
              <input
                type="email"
                value={email}
                id="email"
                placeholder="Digite seu e-mail"
                onChange={(e) => setEmail(e.target.value)} // Correção aqui
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="senha">SENHA</label>
              <input
                type="password"
                value={senha}
                id="senha"
                placeholder="Digite uma senha"
                onChange={(e) => setSenha(e.target.value)} // Correção aqui
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
              <input
                type="password"
                value={confirmarSenha}
                id="confirmarSenha"
                placeholder="Confirme sua senha"
                onChange={(e) => setConfirmarSenha(e.target.value)} // Correção aqui
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
                maxLength="14"
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
                maxLength="12"
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                value={cep}
                id="cep"
                onChange={handleCepChange} // Chamada para a função handleCepChange
                placeholder="XXXXX-XXX"
                maxLength="9"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="rua">RUA</label>
              <input
                type="text"
                value={rua}
                id="rua"
                onChange={(e) => setRua(e.target.value)} // Correção aqui
                placeholder="Rua"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="numero">NUMERO</label>
              <input
                type="text"
                value={numero}
                id="numero"
                onChange={(e) => setNumero(e.target.value)} // Correção aqui
                placeholder="Número"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="bairro">BAIRRO</label>
              <input
                type="text"
                value={bairro}
                id="bairro"
                onChange={(e) => setBairro(e.target.value)} // Correção aqui
                placeholder="Bairro"
                required
              />
            </div>
            <div className={styles.input_group}>
              <label htmlFor="cidade">CIDADE</label>
              <input
                type="text"
                value={cidade}
                id="cidade"
                onChange={(e) => setCidade(e.target.value)} // Correção aqui
                placeholder="Cidade"
                required
              />
            </div>
            <button type="submit">CADASTRAR</button>
          </form>
          {success && <div className={styles.success}>{success}</div>}
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </section>
  );
}

export default RegisterUser;
