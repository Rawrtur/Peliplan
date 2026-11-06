import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  normalizeEmail,
  publicUser,
  createToken,
  generateVerficationCode,
} from "../utils/auth.util.js";
import { sendVerificationEmail } from "../utils/sendEmail.util.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    // Logic to create a new User
    const { email, name, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    session.startTransaction();
    // Check if User already exists
    const existingUser = await User.findOne({ email: normalizedEmail }).session(
      session,
    );

    const verificationCode = generateVerficationCode();

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    if (existingUser) {
      if (existingUser.verified) {
        // Falls User bereits verifiziert ist
        const error = new Error("User already exists.");
        error.statusCode = 409;
        throw error;
      }
      // daten abprüfen
      const isCorrectPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isCorrectPassword) {
        // Fehler für falsches Passwort, da es sonst von einer anderen Person kommen kann
        const error = new Error("User already exists with other details.");
        error.statusCode = 409;
        throw error;
      }
      // sonst neuen Nutzer zum verifizieren weiter leiten
      existingUser.verificationCode = hashedVerificationCode;
      existingUser.verificationExpiresIn = new Date(
        Date.now() + 15 * 60 * 1000,
      );
      // Code wird nach dem else gesendet

      await existingUser.save({ session });
    } else {
      const hashedPassword = await bcrypt.hash(password, salt);
      // neuen User anlegen mit gegebenen Daten
      await User.create(
        [
          {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            verified: false,
            verificationCode: hashedVerificationCode,
            verificationExpiresIn: new Date(Date.now() + 15 * 60 * 1000),
            lastStreakDate: new Date(),
          },
        ],
        {
          session,
        },
      );
    }

    await session.commitTransaction();
    await sendVerificationEmail(normalizedEmail, verificationCode);

    res.status(201).json({
      success: true,
      message: "VerificationCode sended", // zum verifizieren weiter leiten
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

export const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    // Angriffsversuche herausfiltern
    if (
      !user || // keine richtige Email -> Versuch Accounts zu finden
      !user.verificationCode // User hat seinen Code bereits eingelöst -> Versuch in ein Account zu gelangen
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid verfication data",
      });
    }

    if (
      !user.verificationExpiresIn ||
      user.verificationExpiresIn.getTime() < Date.now()
    ) {
      return res.status(400).json({
        error: "Code is expired",  // Nutzer Fehler geben falls Code bereits abgelaufen ist
      });
    }

    const isCodeValid = await bcrypt.compare(code, user.verificationCode);

    if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid Verification Code.",
      });
    }

    if (user.pendingEmail) {  // falls Email adresse geändert wurde, wird diese nun übernommen
      user.email = user.pendingEmail;
      user.pendingEmail = null;
    }

    user.verified = true;
    user.verificationCode = null;  // WICHTING: Daten müssen zurück gesetzt werden, damit die Angriffserkennungslogik funktioniert
    user.verificationExpiresIn = null;

    await user.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.verified) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a verification code has been sent.",
      });
    }

    const verificationCode = generateVerficationCode();
    const salt = await bcrypt.genSalt(10);
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    user.verificationCode = hashedVerificationCode;
    user.verificationExpiresIn = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationCode);

    res.status(200).json({
      success: true,
      message: "VerificationCode sended",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address first.",
      });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "User Signed In successfully",
      data: {
        token,
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    /*
     * With a stateless JWT, the client removes the token.
     *
     * If you later introduce refresh tokens, implement
     * server-side refresh-token revocation here.
     */
    return res.status(200).json({
      success: true,
      message: "User signed out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
