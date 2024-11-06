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

// Rota para buscar carros com filtros e paginação
app.get("/cars/catalogo", (req, res) => {
  const { precoMax, marca, modelo, ano, page = 1, limit = 12 } = req.query;

  // Validação dos parâmetros de paginação
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ message: "Página inválida." });
  }
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: "Limite inválido." });
  }

  const offset = (page - 1) * limit;

  let query = "SELECT * FROM carros WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM carros WHERE 1=1";
  let params = [];

  // Adicionando filtros de preço
  if (precoMax) {
    query += " AND preco <= ?";
    countQuery += " AND preco <= ?";
    params.push(precoMax);
  }

  // Adicionando filtro de marca
  if (marca) {
    query += " AND marca LIKE ?";
    countQuery += " AND marca LIKE ?";
    params.push(`%${marca}%`);
  }

  // Adicionando filtro de modelo
  if (modelo) {
    query += " AND modelo LIKE ?";
    countQuery += " AND modelo LIKE ?";
    params.push(`%${modelo}%`);
  }

  // Adicionando filtro de ano
  if (ano) {
    query += " AND ano = ?";
    countQuery += " AND ano = ?";
    params.push(ano);
  }

  // Adicionando paginação
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  // Primeiro, obtém o total de registros para calcular o total de páginas
  db.query(countQuery, params.slice(0, -2), (countErr, countResult) => {
    if (countErr) {
      console.error("Erro ao contar carros:", countErr);
      return res.status(500).json({ message: "Erro ao buscar carros." });
    }

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Executa a consulta com paginação para obter os carros filtrados
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Erro ao buscar carros:", err);
        return res.status(500).json({ message: "Erro ao buscar carros." });
      }

      res.json({
        results,
        page: parseInt(page),
        totalPages,
        totalItems,
      });
    });
  });
});

// Rota para buscar sugestões de marcas ou modelos
app.get("/cars/autoComplete", (req, res) => {
  const { query } = req.query;

  // Verifica se o parâmetro de busca foi fornecido
  if (!query) {
    return res.status(400).json({ message: "A consulta é obrigatória." });
  }

  // Consulta ao banco de dados para buscar marcas e modelos
  const searchQuery = `%${query}%`;
  const queryString =
    "SELECT DISTINCT marca, modelo FROM carros WHERE marca LIKE ? OR modelo LIKE ? LIMIT 10";
  db.query(queryString, [searchQuery, searchQuery], (err, results) => {
    if (err) {
      console.error("Erro ao buscar sugestões:", err);
      return res.status(500).json({ message: "Erro ao buscar sugestões." });
    }

    // Mapeia as sugestões para um formato que o AutoComplete do Ant Design pode usar
    const suggestions = results.map((result) => ({
      value: result.modelo, // Ou use result.marca se quiser sugerir marcas também
    }));

    res.json({ suggestions });
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

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
