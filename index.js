//Libraries 
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

//Local file dependencies
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

//Create new instances
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

//METHOD: Syncs chains from various instances
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        //Status Code of 200 indicates success
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

let PEER_PORT;

//Generates new port for other instances. Important so that instances connect
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

//Testing if push successful
//If port undefined, set back to default por t of 3000
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening at localHost: ${PORT}`);

    //Eliminate redundant messages by not publishing to itself
    if(PORT !== DEFAULT_PORT) {
        syncChains();
    }
});