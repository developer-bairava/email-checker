import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mailRoutes from "./routes/mail.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/mail", mailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Email Checker Backend running on http://localhost:${PORT}`);
});
