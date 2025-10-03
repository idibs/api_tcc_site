import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend React
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/", publicRoutes);
app.use("/", privateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
