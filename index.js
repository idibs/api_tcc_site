import express from "express";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/", publicRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
