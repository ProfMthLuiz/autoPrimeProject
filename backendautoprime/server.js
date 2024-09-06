const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Configuração do CORS
app.use(cors());

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
  database: "marketplace_carros",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados!");
});

// Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota para adicionar um anúncio
app.post("/adicionar-anuncio", upload.array("imagens", 5), (req, res) => {
  const { modelo, marca, ano, preco, descricao } = req.body;
  const imagens_urls = req.files ? req.files.map((file) => file.filename) : [];

  const sql =
    "INSERT INTO carros (modelo, marca, ano, preço, descrição, imagens_urls) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [modelo, marca, ano, preco, descricao, JSON.stringify(imagens_urls)],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir no banco de dados:", err);
        res.status(500).send("Erro ao adicionar anúncio.");
        return;
      }
      res.send("Anúncio adicionado com sucesso!");
    }
  );
});

// Rota para listar todos os anúncios
app.get("/anuncios", (req, res) => {
  const sql = "SELECT * FROM carros";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar anúncios:", err);
      res.status(500).send("Erro ao buscar anúncios.");
      return;
    }

    // Garanta que imagens_urls é sempre um array
    results.forEach((result) => {
      result.imagens_urls = JSON.parse(result.imagens_urls || "[]");
    });

    res.json(results);
  });
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
