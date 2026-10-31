import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) =>
  res.send({ message: "NIY: GET All Users" }),
);
userRouter.get("/user/me", (req, res) =>
  res.send({ message: "NIY: GET User Details" }),
);
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
