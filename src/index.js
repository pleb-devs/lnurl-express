const express = require('express');
require('express-async-errors');
const HttpError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { lnd } = require('./utils');
const { errorHandlingMiddlerware } = require('./middleware');

dotenv.config();

const app = express();

lnd.connect();

app.use(bodyParser.json());

app.use(cors({
   origin: '*',
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.get('/', (req, res) => {
   res.send('Im alive!');
});


app.get('/error', (req, res) => {
   const { message } = req.query;

   if (!message) {
      throw new HttpError[400]("Missing message query parameter");
   }

   throw new Error(message);
});


app.use("/", require("./routes"));

app.use(errorHandlingMiddlerware);

app.listen(process.env.PORT || 3000, () => {
   console.log(`Server listening on port ${process.env.PORT || 3000}`);
});