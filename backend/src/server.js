// backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import membrosRoutes from "./routes/membrosRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "backend ok" });
});

app.use("/api", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/posts",  postsRoutes);
app.use("/membros", membrosRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});