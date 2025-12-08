export const errorHandler = (err, req, res, next) => {
    console.error(err); // for debugging
  
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }
  
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value.",
        field: err.keyValue,
      });
    }
  
    // CastError (invalid MongoDB ObjectId)
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
  
    // Default server error
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  };
  