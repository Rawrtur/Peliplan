import { Router } from "express";
import {
  deleteUser,
  forgotPassword,
  getUserbyId,
  getUsers,
  resetPassword,
  updateEmail,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, authorizeAdmin, getUsers);
userRouter.get("/user/:id", authorize, getUserbyId);
userRouter.put("/password/me",authorize, updateUserPassword);
userRouter.put("/email/me",authorize, updateEmail);
userRouter.put("/reset-password/me",authorize, resetPassword);
userRouter.put("/forgot-password/me",authorize, forgotPassword);
userRouter.delete("/me",authorize, deleteUser);

export default userRouter;
