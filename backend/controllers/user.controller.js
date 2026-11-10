import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendEmail.util.js";
import { generateVerficationCode, normalizeEmail } from "../utils/auth.util.js";
import mongoose from "mongoose";
import Template from "../models/template.model.js";

/**
 * gets all the user
 * Admin only Function
 * @param {*} req Request Body
 * @param {*} res Response Body
 * @param {*} next  Next Function
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users, // muss kein Public User sein, da es eh für Admins ausgelegt ist
    });
  } catch (error) {
    next(error);
  }
};
/**
 * gets the user data for a single user
 * Admin only function
 * @param {*} req Request Body
 * @param {*} res Response Body
 * @param {*} next next function
 */
export const getUserbyId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a Users Password
 * authorize must be used before
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next next function
 */
export const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Passwird is incorrect.");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated password successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * update the email for a user and set the verication to false
 * must use authorize before
 * @param {*} req Request
 * @param {*} res  Response
 * @param {*} next next function
 * @returns  None
 */
export const updateEmail = async (req, res, next) => {
  try {
    const { newEmail, password } = req.body;

    const normalizedEmail = normalizeEmail(newEmail);

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.email === normalizedEmail)
      return res.status(200).json({
        success: true,
        message: "Email is already up to date.",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { pendingEmail: normalizedEmail }],
      _id: { $ne: user._id },
    });

    if (existingUser) {
      const error = new Error("Email address is already in use");
      error.statusCode = 409;
      throw error;
    }

    const verificationCode = generateVerficationCode();

    const salt = await bcrypt.genSalt(10);
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    user.pendingEmail = normalizedEmail;
    user.verified = false;
    user.verificationCode = hashedVerificationCode;
    user.verificationExpiresIn = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationCode);

    res.status(200).json({
      success: true,
      message: "Updated email successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the Name for a user
 * must use authorize before
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next next function
 */
export const updateName = async (req, res, next) => {
  try {
    const { newName, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User was not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Current Password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    user.name = newName.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated Name successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user._id;

    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await Template.deleteMany({user: userId}, {session})
    await User.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Deleted User successfully",
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


export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });

    if (!user) {
      // Wichtig: Immer gleiche Antwort, egal ob E-Mail existiert!
      return res.json({
        message: "If the email address exists, a link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    await sendVerificationEmail(user.email, rawToken);

    res.status(201).json({
      success: true,
      message: "If the email address exists, a link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updatet Password successfully.",
    });
  } catch (error) {
    next(error);
  }
};
