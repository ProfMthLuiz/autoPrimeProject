const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3001;

// Verifica se a pasta "uploads" existe, se não, cria
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do CORS
app.use(cors());

// Middleware para processar JSON
app.use(bodyParser.json());
app.use("/uploads", express.static(uploadDir)); // Certifique-se de usar o diretório "uploads"

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Certifique-se de usar o diretório "uploads" verificado
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Configuração do banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "autoprimebd",
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION, // ex: 1h
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION, // ex: 7d
  });
};

// Rota para cadastrar carros
app.post("/registerCars", upload.array("fotos", 10), (req, res) => {
  const { marca, modelo, ano, preco, descricao } = req.body;
  const fotos = req.files.map((file) => file.filename); // Salvar os nomes dos arquivos de imagem

  // Verificar se os campos necessários estão presentes
  if (!marca || !modelo || !ano || !preco || !descricao || fotos.length === 0) {
    return res.status(400).json({
      message: "Preencha todos os campos e envie ao menos uma imagem!",
    });
  }

  // Consulta para inserir os dados no banco de dados
  const query =
    "INSERT INTO carros (marca, modelo, ano, preco, descricao, imagens) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [marca, modelo, ano, preco, descricao, JSON.stringify(fotos)],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir carro no banco de dados: ", err);
        return res.status(500).json({ message: "Erro ao cadastrar o carro." });
      }

      res.status(201).json({ message: "Carro cadastrado com sucesso!" });
    }
  );
});

app.get("/anuncios", (req, res) => {
  const query = "SELECT * FROM carros";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados da tabela carros:", err);
      console.log("eroooooo");
      return res.status(500).json({ message: "Erro ao buscar os carros." });
    }
    res.json(results);
    console.log(results);
  });
});

// Rota para cadastrar usuários
app.post("/registerUser", async (req, res) => {
  const {
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
  } = req.body;

  // Verifica se todos os campos necessários estão presentes
  if (
    !nome ||
    !sobrenome ||
    !email ||
    !senha ||
    !phone ||
    !cpf ||
    !rg ||
    !cep ||
    !rua ||
    !numero ||
    !bairro ||
    !cidade
  ) {
    return res.status(400).json({
      message: "Por favor, preencha todos os campos!",
    });
  }

  // Hasheando a senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  // Consulta para inserir os dados no banco de dados
  const query =
    "INSERT INTO usuarios (nome, sobrenome, email, celular, cpf, rg, senha, cep, rua, numero, bairro, cidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      nome,
      sobrenome,
      email,
      phone,
      cpf,
      rg,
      hashedPassword, // Armazena a senha hasheada
      cep,
      rua,
      numero,
      bairro,
      cidade,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir usuário no banco de dados: ", err);
        return res
          .status(500)
          .json({ message: "Erro ao cadastrar o usuário." });
      }

      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    }
  );
});

// Rota de login (corrigida)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Busca o usuário no banco de dados
  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erro ao buscar o usuário no banco: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno no servidor." });
    }

    // Verifica se o usuário foi encontrado
    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "E-mail incorreto." });
    }

    const user = results[0];

    // Verifica se a senha está correta usando bcrypt
    const isMatch = await bcrypt.compare(password, user.senha);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Senha incorreta." });
    }

    // Gerar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Você pode salvar o refresh token no banco de dados ou em memória
    // Exemplo: Salvar o refresh token no banco de dados associado ao usuário

    return res.status(200).json({
      success: true,
      message: "Login bem-sucedido!",
      accessToken,
      refreshToken,
    });
  });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Token ausente." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido." });

    req.user = user; // Salva o usuário no request
    next();
  });
};

app.post("/token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token ausente." });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Refresh token inválido." });

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    res.json({ accessToken: newAccessToken });
  });
});

app.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  // Aqui você pode remover o refresh token da lista ou banco
  res.json({ message: "Logout bem-sucedido." });
});

// Rota para salvar o contato
app.post("/salvarContato", (req, res) => {
  const { nome, email, mensagem } = req.body;

  // Verificar se todos os campos foram preenchidos
  if (!nome || !email || !mensagem) {
    return res.status(400).json({
      message: "Por favor, preencha todos os campos.",
    });
  }

  // Inserir no banco de dados
  const query = "INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)";

  db.query(query, [nome, email, mensagem], (err, result) => {
    if (err) {
      console.error("Erro ao salvar contato no banco de dados: ", err);
      return res.status(500).json({ message: "Erro ao salvar o contato." });
    }

    res.status(201).json({ message: "Contato enviado com sucesso!" });
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
