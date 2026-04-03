import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "dcaii8a2m",
  api_key: "763781518433662",
  api_secret: "NjkLqtNRxl3XTWOVvIFsfEhb8fs"
});
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
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("Nenhuma imagem enviada");
    }

    const imagensSalvas = [];

    for (const file of files) {

      const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "app-loja"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      imagensSalvas.push({
        nome: file.originalname,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
    }

    await Imagens.insertMany(imagensSalvas);

    res.send({ ok: true, imagens: imagensSalvas });

  } catch (err) {
    console.error("ERRO CLOUDINARY:", err);
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
