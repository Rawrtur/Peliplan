import { Router } from "express";
import {
  deleteUser,
  forgotPassword,
  getUserbyId,
  getUsers,
  resetPassword,
  updateEmail,
  updateName,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.get("/", authorize, authorizeAdmin, getUsers);
userRouter.get("/user/:id", authorize,authorizeAdmin, getUserbyId);
userRouter.put("/password/me",authorize, updateUserPassword);
userRouter.put("/email/me",authorize, updateEmail);
userRouter.put("/name/me",authorize, updateName);
userRouter.put("/reset-password/me", resetPassword);
userRouter.put("/forgot-password/me", forgotPassword);
userRouter.delete("/me",authorize, deleteUser);

export default userRouter;
