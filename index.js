import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import cors from "cors";

const app = express();

// A Railway exige usar process.env.PORT
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Configuração de CORS
app.use(
  cors({
    origin: [
      "https://www.rbscerais.com.br", // seu domínio Vercel
      "https://rbscerais.com.br", // sem www (opcional)
      "http://localhost:5173", // para desenvolvimento
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Suas rotas
app.use("/", publicRoutes);
app.use("/", privateRoutes);

// Listener
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
