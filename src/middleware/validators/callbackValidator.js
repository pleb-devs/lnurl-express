const { checkSchema } = require('express-validator');

const callbackRequestSchema = {
  amount: {
    in: ['query'],
    isInt: true,
    toInt: true,
    errorMessage: 'Amount must be an integer',
    customSanitizer: {
      options: (value) => {
        return parseInt(value);
      }
    }
  }
}

const callbackRequestValidator = checkSchema(callbackRequestSchema);

module.exports = callbackRequestValidator;