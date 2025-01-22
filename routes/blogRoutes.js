import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "../controller/blogController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", isAdmin, createBlog);

router.get("/getAll", getAllBlogs);

router.get("/get/:id", getBlogById);

router.delete("/delete/:id", isAdmin, deleteBlog);

router.post("/update/:id", isAdmin, updateBlog);

export default router;
