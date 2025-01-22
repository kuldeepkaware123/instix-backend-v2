import express from "express";
import dotenv from "dotenv";
import ConnectDb from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(morgan("tiny"));

// // express file upload
import fileUpload from "express-fileupload";
app.use(fileUpload());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});

// =============================== Routes ================================

import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/admin/blog", blogRoutes);

// ================================ Routes End ============================

ConnectDb(process.env.MONGO_URL);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
