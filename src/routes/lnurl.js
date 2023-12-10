const express = require("express");
const bech32 = require("bech32");

const router = express.Router();

router.get("/", (req, res) => {
  const metadata = [["text/plain", "Austin's LNURL-PAY endpoint"]];
  const response = {
    callback: `${process.env.BACKEND_URL}/callback`,
    maxSendable: 100000000, // milisatoshis
    minSendable: 1000, // milisatoshis
    metadata: JSON.stringify(metadata),
    tag: "payRequest",
  };
  res.json(response);
});

router.post("/", async (req, res) => {
  const originalUrl = `${process.env.BACKEND_URL}/lnurl`;
  const encodedLnurl = encodeLnurl(originalUrl);

  res.json({
    lnurl: encodedLnurl,
  });
});

function encodeLnurl(url) {
  const words = bech32.toWords(Buffer.from(url, "utf8"));
  return bech32.encode("lnurl", words, 2000).toUpperCase();
}

module.exports = router;