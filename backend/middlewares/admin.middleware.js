
/**
 * check if a request is made by an Admin
 * IMPORTANT: Must use normal authorize before
 * @param {*} req Request 
 * @param {*} res Response
 * @param {*} next Next function
 * @returns None
 */
const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) { // User is not authorizied
      return res.status(401).json({  
        success: false,
        message: "Unauthorized",
      });
    }
    if (req.user.role !== "Admin") { 
      return res.status(401).json({
        success: false,
        message: "Forbidden",
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export default authorizeAdmin;
