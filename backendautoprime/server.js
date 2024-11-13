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

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token não fornecido." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido." });
    req.userId = decoded.id; // Passa o ID do usuário autenticado
    next();
  });
};

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

// Configuração do CORS
app.use(cors());

// Middleware para processar JSON
app.use(bodyParser.json());

// Certifique-se de usar o diretório "uploads"
app.use("/uploads", express.static(uploadDir));

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
  const {
    precoMax,
    precoMin,
    marca,
    modelo,
    ano,
    page = 1,
    limit = 12,
    busca,
  } = req.query;

  let filters = [];
  let queryParams = [];

  // Filtro de marca
  if (marca && marca.length > 0) {
    filters.push(`marca IN (?)`);
    queryParams.push(marca);
  }

  // Filtro de modelo
  if (modelo && modelo.length > 0) {
    filters.push(`modelo IN (?)`);
    queryParams.push(modelo);
  }

  // Filtro de ano
  if (ano && ano.length > 0) {
    filters.push(`ano IN (?)`);
    queryParams.push(ano);
  }

  // Filtro de preço máximo
  if (precoMax) {
    filters.push(`preco <= ?`);
    queryParams.push(precoMax);
  }

  // Filtro de preço mínimo
  if (precoMin) {
    filters.push(`preco >= ?`);
    queryParams.push(precoMin);
  }

  // Filtro de busca
  if (busca) {
    filters.push(`(marca LIKE ? OR modelo LIKE ?)`);
    const searchTerm = `%${busca}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  // Combina os filtros com a consulta
  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  // Consulta para contar o número total de carros com os filtros aplicados
  const countQuery = `SELECT COUNT(*) AS total FROM carros ${whereClause}`;

  db.query(countQuery, queryParams, (err, countResult) => {
    if (err) {
      console.error("Erro ao contar carros:", err);
      return res.status(500).json({ message: "Erro ao buscar carros." });
    }

    const totalCars = countResult[0].total;
    const totalPages = Math.ceil(totalCars / limit);

    // Definir a consulta para buscar os carros com paginação
    const query = `SELECT * FROM carros ${whereClause} LIMIT ?, ?`;
    queryParams.push((page - 1) * limit, parseInt(limit)); // Paginando os resultados

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Erro ao buscar carros:", err);
        return res.status(500).json({ message: "Erro ao buscar carros." });
      }

      res.json({
        results,
        totalPages,
      });
    });
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

// Rota para excluir um carro pelo ID
app.delete("/cars/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Verifica se o ID foi fornecido
  if (!id) {
    return res.status(400).json({ message: "ID do carro não fornecido." });
  }

  // Consulta para deletar o carro do banco de dados
  const deleteQuery = "DELETE FROM carros WHERE id_cars = ?";

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir carro:", err);
      return res.status(500).json({ message: "Erro ao excluir carro." });
    }

    // Verifica se algum registro foi afetado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }

    res.status(200).json({ message: "Carro excluído com sucesso!" });
  });
});

app.get("/cars/autoComplete", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "Parâmetro de busca é obrigatório" });
  }

  // Ajuste para garantir modelos únicos
  const searchQuery = `
    SELECT DISTINCT modelo, marca
    FROM carros
    WHERE modelo LIKE ? OR marca LIKE ?
    ORDER BY modelo ASC
    LIMIT 10
  `;

  const searchValue = `%${query}%`;

  db.query(searchQuery, [searchValue, searchValue], (err, results) => {
    if (err) {
      console.error("Erro ao buscar sugestões de autocomplete:", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }

    const suggestions = results.map((item) => ({
      value: item.modelo, // Só estamos retornando o modelo, para não haver duplicatas
    }));

    res.json({ suggestions });
  });
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
