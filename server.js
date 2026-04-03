import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CONECTAR MONGODB (LOCAL)
mongoose.connect("mongodb+srv://admin:admin22@sasha.5iqy4q1.mongodb.net/sasha?retryWrites=true&w=majority");

console.log("MongoDB conectado");

// 🔥 MODEL
const Localizacao = mongoose.model("Localizacao", {
  latitude: Number,
  longitude: Number,
  data: { type: Date, default: Date.now }
});

// 👥 CONTATOS
const Contato = mongoose.model("Contato", {
  nome: String,
  telefone: String,
  data: { type: Date, default: Date.now }
});

// 🖼️ IMAGENS (metadados apenas)
const Imagens = mongoose.model("Imagens", {
  nome: String,
  data: { type: Date, default: Date.now }
});

app.post("/contatos", async (req, res) => {
  try {
    const { contatos } = req.body;

    console.log("Recebendo contatos:", contatos.length);

    const contatosFormatados = contatos.map(c => ({
      nome: c.nome,
      telefone: c.telefone
    }));

    await Contato.insertMany(contatosFormatados);

    res.send({ ok: true });

  } catch (err) {
    console.error("Erro contatos:", err);
    res.status(500).send("erro");
  }
});
app.post("/upload-imagens", upload.array("imagens"), async (req, res) => {
  try {

    console.log("FILES:", req.files);

    const files = req.files;

    console.log("Imagens:", files?.length);

    await Imagens.insertMany(
      files.map(f => ({ nome: f.originalname }))
    );

    res.send({ ok: true });

  } catch (err) {
    console.error("ERRO IMAGENS:", err);
    res.status(500).send("erro");
  }
});
// 🔥 ROTA
app.post("/localizacao", async (req, res) => {
  const { latitude, longitude } = req.body;

  console.log("Recebido:", latitude, longitude);

  await Localizacao.create({ latitude, longitude });

  res.send({ ok: true });
});

// 🔥 TESTE
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔥 START
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
