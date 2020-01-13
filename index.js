//Libraries 
const bodyParser = require('body-parser');
const express = require('express');

//Local file dependencies
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

//Create new instances
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

//Broadcast chain to any new subscribed node every time new block added to chain
//Delay of 1000 ms to give time for message to register on all subscribed chains
//Allow pubsub implementation to subscribe to all channels ASYNCHRONOUSLY
setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

//GET HTTP requests are designed to read data from the backend
app.get('/api/blocks', (req, res) => {
    //res object defines how requests will respond
    res.json(blockchain.chain);
});

//(!!) Cannot GET /api/mine, because we only have get for /api/blocks

//User is going to receive data in JSON format 
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    //Add block to local blockchain instance
    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

const DEFAULT_PORT = 3000;
let PEER_PORT;

//Generates new port for other instances. Important so that instances connect
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
    //If port undefined, set back to default port of 3000
app.listen(PORT, () => console.log(`Listening at localHost: ${PORT}`));