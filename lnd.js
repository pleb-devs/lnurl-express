const LndGrpc = require("lnd-grpc");
const dotenv = require("dotenv");

dotenv.config();

const options = {
    lndconnectUri: process.env.LND_CONNECT_URI
};

const lnd = new LndGrpc(options);

const connect = async () => {
  try {
    await lnd.connect();

    if (lnd.state !== "active") {
      throw new Error(
        "LND did not reach 'active' state within the expected time"
      );
    }
    
    console.log(`LND gRPC connection state: ${lnd.state}`);

  } catch (e) {
    console.log("error", e);
  }
};

const createInvoice = async ({ value, description_hash }) => {
  const invoice = await lnd.services.Lightning.addInvoice({
    value: value,
    description_hash: description_hash,
  });

  return invoice;
};

module.exports = {
  connect,
  createInvoice
};