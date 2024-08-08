import express from "express";
import BlogsController from "../controller/blog.js";
import UsersController from "../controller/user.js";
import { auth } from "../middleware/auth.js";
import { adminMiddleWare } from "../middleware/admin-middleware.js";
import { ownerMiddleWare } from "../middleware/owner-middleware.js";
const router = express.Router();

router.get("/api/blogs", [auth, adminMiddleWare], BlogsController.get);
router.post("/api/blogs", [auth, ownerMiddleWare], BlogsController.create);
router.get("/api/blogs-search", BlogsController.search);

router.get("/api/profile", [auth], UsersController.getProfile);
router.patch("/api/update-profile", [auth], UsersController.updateProfile);

router.get("/api/users", UsersController.getAllUsers);
router.post("/api/users/sign-up", UsersController.registerUser);
router.post("/api/users/sign-in", UsersController.loginUser);
router.patch("/api/users/:id", UsersController.updateUser);

router.patch("/api/resetPassword", [auth], UsersController.resetPassword);

export default router;
