const HttpError = require('http-errors');

const errorHandler = (err, req, res, next) => {
    console.log(err);
    switch(true) {
      case err instanceof HttpError.HttpError:
        res.status(err.statusCode).send(err.message);
        break;
      default:
        res.status(500).send(err.message);
        break;
    }
}

module.exports = errorHandler;