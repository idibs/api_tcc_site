import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import cors from "cors";

const app = express();

// PORTA DINÂMICA PARA RENDER
const PORT = process.env.PORT || 8080;

app.use(express.json());

// CORS CORRIGIDO
app.use(
  cors({
    origin: ["http://localhost:5173", "https://seusite.com"], // pode colocar seu domínio aqui depois
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ROTAS
app.use("/", publicRoutes);
app.use("/", privateRoutes);

// LISTEN
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
