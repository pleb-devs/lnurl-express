const express = require('express');
const { bech32 } = require('bech32');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const { connect, createInvoice } = require('./lnd');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

connect();

function encodeLnurl(url) {
    const words = bech32.toWords(Buffer.from(url, 'utf8'));
    return bech32.encode('lnurl', words, 2000).toUpperCase();
}

app.get('/getlnurl', async (req, res) => {
    const originalUrl = `${process.env.BACKEND_URL}/lnurl`
    const encodedLnurl = encodeLnurl(originalUrl);

    res.json({
        lnurl: encodedLnurl
    });
});

app.get('/lnurl', (req, res) => {
    const metadata = [
        ["text/plain", "Sample LNURL-PAY endpoint"]
    ];
    const response = {
        callback: `${process.env.BACKEND_URL}/callback`,
        maxSendable: 100000000, // milisatoshis
        minSendable: 1000,      // milisatoshis
        metadata: JSON.stringify(metadata),
        tag: "payRequest"
    };
    res.json(response);
});

app.get('/callback', async (req, res) => {
    const { amount } = req.query;

    const metadata = [["text/plain", "Sample LNURL-PAY endpoint"]];
    const metadataString = JSON.stringify(metadata);
    const hash = crypto.createHash('sha256').update(metadataString).digest('hex');
    
    const descriptionHash = Buffer.from(hash, 'hex').toString('base64'); // Encoding as base64

    // Convert amount from millisatoshis to satoshis
    const value = parseInt(amount) / 1000;

    const invoice = await createInvoice({ value, description_hash: descriptionHash });

    console.log(invoice);

    const response = {
        pr: invoice.payment_request,
        routes: []
    };

    res.json(response);
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
