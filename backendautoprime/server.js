const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt");

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

// Rota de login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Busca o usuário no banco de dados
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
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

    // Verifica se a senha está correta (para este exemplo simples, sem hashing)
    if (password !== user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Senha incorreta." });
    }

    // Se tudo estiver correto, envia a mensagem de sucesso
    return res
      .status(200)
      .json({ success: true, message: "Login bem-sucedido!" });
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados!");
});

// Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(uploadDir)); // Certifique-se de usar o diretório "uploads"

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
