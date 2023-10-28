const LndGrpc = require("lnd-grpc");
const dotenv = require("dotenv");

dotenv.config();

const options = {
    lndconnectUri: process.env.LND_CONNECT_URI
};

const lnd = new LndGrpc(options);

const maxRetries = 5;
const baseDelay = 1000;  // initial delay is 1000ms, or 1 second

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const connect = async (retryCount = 0) => {
  try {
    await lnd.connect();

    if (lnd.state !== "active") {
      throw new Error("LND did not reach 'active' state within the expected time");
    }

    console.log(`LND gRPC connection state: ${lnd.state}`);
    // invoiceEventStream();  // Uncomment this line if you want to start the invoice event stream here
  } catch (e) {
    console.log("error", e);

    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);  // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
      await connect(retryCount + 1);  // Recursive retry
    } else {
      console.error('Max retries reached. Could not connect to LND.');
    }
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