import { Router } from "express";
import {
  signOut,
  signUp,
  signIn,
  verify,
  resendVerify,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/verify", verify);

authRouter.post("/resend-verify", resendVerify);

authRouter.post("/sign-out", signOut);

export default authRouter;
