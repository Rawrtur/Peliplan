import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) =>
  res.send({ message: "NIY: POST Sign Up" }),
);
authRouter.post("/sign-in", (req, res) =>
  res.send({ message: "NIY: POST Sign In" }),
);
authRouter.post("/verify", (req, res) =>
  res.send({ message: "NIY: VERIFY User" }),
);
authRouter.post("/resend-verify", (req, res) =>
  res.send({ message: "NIY: RESEND Verify code" }),
);
authRouter.post("/sign-out", (req, res) =>
  res.send({ message: "NIY: POST Sign Out" }),
);

export default authRouter;
