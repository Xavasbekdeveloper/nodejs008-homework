import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users, validateUser } from "../models/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

class UsersController {
  async registerUser(req, res) {
    try {
      const { error } = validateUser(req.body);
      if (error)
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });

      const { username, password } = req.body;

      const existingUser = await Users.findOne({ username });
      if (existingUser)
        return res.status(400).json({
          msg: "User already exists.",
          variant: "error",
          payload: null,
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await Users.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json({
        msg: "User registered successfully",
        variant: "success",
        payload: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async loginUser(req, res) {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (!user)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({
        msg: "Invalid username or password.",
        variant: "error",
        payload: null,
      });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      msg: "Logged in successfully",
      variant: "success",
      payload: token,
    });
  }

  async getAllUsers(req, res) {
    try {
      const users = await Users.find().sort({ createdAt: -1 });
      res.status(200).json({
        msg: "Users fetched successfully",
        variant: "success",
        payload: users,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const existingUser = await Users.findOne({ username: req.body.username });
      if (existingUser && id != existingUser._id.toString())
        return res.status(400).json({
          msg: "User already exists.",
          variant: "error",
          payload: null,
        });

      req.body.password = existingUser.password;
      let user = await Users.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        msg: "user updated",
        variant: "success",
        payload: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }

  async getProfile(req, res) {
    try {
      let user = await Users.findById(req.user._id);
      res.status(200).json({
        msg: "User fetched successfully",
        variant: "success",
        payload: user,
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const id = req.user._id;
      const { username } = req.body;

      const user = await Users.findById(id);
      if (!user) {
        return res.status(400).json({
          msg: "user not found",
          variant: "error",
          payload: null,
        });
      }

      const checkUsername = await Users.findOne({ username });
      if (checkUsername && checkUsername._id.toString() !== id) {
        return res.status(400).json({
          msg: "username already exists",
          variant: "warning",
          payload: null,
        });
      }

      const updateUser = await Users.findByIdAndUpdate(
        id,
        { ...req.body, password: user.password },
        { new: true }
      );

      return res.status(200).json({
        msg: "profile updated successfully",
        variant: "success",
        payload: updateUser,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const id = req.user._id;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(400).json({
          msg: "User not found",
          variant: "error",
          payload: null,
        });
      }

      const { password, newPassword } = req.body;
      bcrypt.compare(password, user.password, async function (err, result) {
        if (result) {
          let hashPassword = await bcrypt.hash(newPassword, 10);
          let updateUser = await Users.findByIdAndUpdate(
            id,
            { password: hashPassword },
            { new: true }
          );
          return res.status(200).json({
            msg: "Password updated successfully",
            variant: "success",
            payload: updateUser,
          });
        } else {
          return res.status(400).json({
            msg: "Invalid password",
            variant: "error",
            payload: null,
          });
        }
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new UsersController();
