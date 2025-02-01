import Blog from "../models/blogModel.js";
import { errorResponse, successResponse } from "../middlewares/responses.js";
import { initImageKit } from "../utils/imageKit.js";
import path from "path";
const imagekit = initImageKit();

export const createBlog = async (req, res) => {
  try {
    const file = req.files?.image;
    const { title, category, description, metaKeywords, metaDescription } =
      req.body;
    if (!file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    switch (true) {
      case !title:
        return errorResponse(res, "Title is required", 400);
      case !metaKeywords:
        return errorResponse(res, "Meta keywords is required", 400);
      case !category:
        return errorResponse(res, "Category is required", 400);
      case !description:
        return errorResponse(res, "Description is required", 400);
      case !metaDescription:
        return errorResponse(res, "Meta description is required", 400);
    }

    const fileName = `instix-${Date.now()}${path.extname(file.name)}`;
    const result = await imagekit.upload({
      file: file.data,
      fileName,
    });

    const blog = new Blog({
      title,
      category,
      description,
      metaKeywords,
      metaDescription,
      image: {
        fileId: result.fileId,
        url: result.url,
      },
    });

    await blog.save();

    return successResponse(res, "Blog created successfully", blog, 201);
  } catch (error) {
    console.error("Error in createBlog: ", error);
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return successResponse(res, "Blogs fetched successfully", blogs);
  } catch (error) {
    console.error("Error in getAllBlogs: ", error);
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }
    return successResponse(res, "Blog fetched successfully", blog);
  } catch (error) {
    console.error("Error in getBlogById: ", error);
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    // Delete image from imagekit
    await imagekit.deleteFile(blog.image.fileId);

    await blog.deleteOne();
    return successResponse(res, "Blog deleted successfully");
  } catch (error) {
    console.error("Error in deleteBlog: ", error);
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return errorResponse(res, "Blog not found", 404);
    }

    // check if image is updated

    const file = req.files?.image;
    const { title, category, description, metaKeywords, metaDescription } =
      req.body;

    if (file) {
      const fileName = `instix-${Date.now()}${path.extname(file.name)}`;
      const result = await imagekit.upload({
        file: file.data,
        fileName,
      });

      await imagekit.deleteFile(blog.image.fileId);

      blog.image.fileId = result.fileId;
      blog.image.url = result.url;
    }

    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.description = description || blog.description;
    blog.metaKeywords = metaKeywords || blog.metaKeywords;
    blog.metaDescription = metaDescription || blog.metaDescription;

    await blog.save();

    return successResponse(res, "Blog updated successfully", blog);
  } catch (error) {
    console.error("Error in updateBlog: ", error);
    return errorResponse(res, "Internal server error", 500, error);
  }
};
