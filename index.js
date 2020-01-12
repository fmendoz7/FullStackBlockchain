const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

//GET HTTP requests are designed to read data from the backend
app.get('/api/blocks', (req, res) => {
    //res object defines how requests will respond
    res.json(blockchain.chain);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening at localHost: ${PORT}`));