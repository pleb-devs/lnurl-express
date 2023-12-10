const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => error);
    console.log("VALIDATION ERRORS", validationErrors);
    
    return res
    .status(400)
    .json({ errors: errors.array().map((error) => error.msg) });
  }

  next();
};

module.exports = handleValidationErrors;