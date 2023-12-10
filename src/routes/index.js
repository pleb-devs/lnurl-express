const express = require("express");
const { handleCallback } = require("../controllers");
const { callbackRequestValidator, handleValidationErrors } = require("../middleware")

const router = express.Router();

router.get("/callback", callbackRequestValidator, handleValidationErrors, handleCallback);

router.use("/lnurl", require("./lnurl"));

module.exports = router;