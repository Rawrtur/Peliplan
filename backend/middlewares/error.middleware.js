const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;

    console.error(err);
    let message;
    let statusCode;
    //Mongoose bad ObjectId
    if (err.name === "CastError") {
      message = "Resource not found";
      statusCode = 404;
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
      message = "Duplicate Key Value entered";
      statusCode = 400;
    }

    //Mongoose Validation Error
    if (err.name === "ValidationError") {
      message = Object.values(err.errors)
        .map((val) => val.message)  // maping da wir mehrere validation errors haben können
        .join(", ");
      statusCode = 400;
    }

    error = new Error(message);
    error.statusCode = statusCode;

    res 
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server Error" });  
  } catch (error) {
    next(error);
  }
};


export default errorMiddleware;