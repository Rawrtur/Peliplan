import User from "../models/user.model.js";

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
