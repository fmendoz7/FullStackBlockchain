const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

//GET HTTP requests are designed to read data from the backend
app.get('/api/blocks', (req, res) => {
    //res object defines how requests will respond
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    //Add block to local blockchain instance
    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening at localHost: ${PORT}`));