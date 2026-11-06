import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * authorize a user before a user relevant action for safety
 * @param {*} req Request Body
 * @param {*} res Response Body
 * @param {*} next next function
 * @returns None
 */
export const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Wenn kein Token gefunden wurde oder request body unvollständig ist
    if (!token)
      return res.status(401).json({ message: "Unauthorized", success: false });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId);

    req.user = user; // User speichern

    next(); // nächste Funktion laden
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};
