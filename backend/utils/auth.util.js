import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import jwt from "jsonwebtoken";

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    role: user.role,
    streak: user.streak,
  };
}

export function createToken(userId) {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

export const generateVerficationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
