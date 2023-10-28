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

    // Start the invoice event stream on successful connection
    // We want to always be listening for invoice events while the server is running
    invoiceEventStream();
  } catch (e) {
    console.log("error", e);
  }
};

const createInvoice = async ({ value, memo }) => {
  // Use the 'addInvoice' method from the Lightning service of the 'grpc' module to create an invoice.
  // This method requires an object parameter with 'value' and 'memo' properties.
  // This method is asynchronous, so we use 'await' to pause execution until it completes.
  const invoice = await lnd.services.Lightning.addInvoice({
    value: value,
    memo: memo,
  });

  return invoice;
};

const invoiceEventStream = async () => {
  await lnd.services.Lightning.subscribeInvoices({
    add_index: 0,
    settle_index: 0,
  })
    .on("data", async (data) => {
      console.log("on data:", data);
    })
    .on("error", (err) => {
      console.log(err);
    });
};

module.exports = {
    lnd,
  connect,
  createInvoice,
  invoiceEventStream,
};