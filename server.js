import express from "express";
import mongoose from "mongoose";
import cors from "cors";

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