const { lnd } = require("../utils");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const handleCallback = async (req, res) => {
  const { amount } = req.query;

  console.log("ERROR", validationResult(req))

  const metadata = [["text/plain", "Austin's LNURL-PAY endpoint"]];
  const metadataString = JSON.stringify(metadata);
  const hash = crypto.createHash("sha256").update(metadataString).digest("hex");

  const descriptionHash = Buffer.from(hash, "hex").toString("base64"); // Encoding as base64

  // Convert amount from millisatoshis to satoshis
  const value = parseInt(amount) / 1000;

  const invoice = await lnd.createInvoice({
    value,
    description_hash: descriptionHash,
  });

  console.log(invoice);

  const response = {
    pr: invoice.payment_request,
    routes: [],
  };

  res.json(response);
};

module.exports = {
  handleCallback,
};