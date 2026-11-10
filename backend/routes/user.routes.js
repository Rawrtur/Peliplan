import { Router } from "express";
import { getUserbyId, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/admin.middleware.js";

const userRouter = Router();

userRouter.get("/",authorize,authorizeAdmin, getUsers);

userRouter.get("/user/:id",authorize, getUserbyId);

userRouter.post("/", (req, res) =>
  res.send({ message: "NIY: CREATE new User" }),
);
userRouter.put("/password/me", (req, res) =>
  res.send({ message: "NIY: UPDATE Users password" }),
);
userRouter.put("/email/me", (req, res) =>
  res.send({ message: "NIY: UPDATE Users email" }),
);
userRouter.put("/reset-password/me", (req, res) =>
  res.send({ message: "NIY: RESET User password" }),
);
userRouter.delete("/me", (req, res) =>
  res.send({ message: "NIY: DELETE User" }),
);

export default userRouter;
