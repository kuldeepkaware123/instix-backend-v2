import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { errorResponse, successResponse } from "../middlewares/responses.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    switch (true) {
      case !email:
        return errorResponse(res, "Email is required", 400);
      case !password:
        return errorResponse(res, "Password is required", 400);
    }

    const existAdmin = await Admin.findOne({ email });

    if (existAdmin) {
      return errorResponse(res, "Email already exists", 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    if (!newAdmin) {
      return errorResponse(res, "Admin not created", 500);
    }

    return successResponse(res, "Admin created successfully !", newAdmin, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    switch (true) {
      case !email:
        return errorResponse(res, "Email is required", 400);
      case !password:
        return errorResponse(res, "Password is required", 400);
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return errorResponse(res, "Password or Email is incorrect", 400);
    }

    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
      return errorResponse(res, "Password or Email is incorrect", 400);
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const validateToken = async (req, res) => {
  try {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: "Authorization required !",
      });
    }

    var token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Authorization failed !",
      });
    } else {
      const admin = await Admin.findById(decode.id);

      if (!admin) {
        return res.status(400).json({
          success: false,
          message: "Authorization failed !",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Token is valid",
          admin,
        });
      }
    }
  } catch (error) {
    if (error === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "invalid token",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Your token is expired or invalid",
        error,
      });
    }
  }
};
