//Libraries 
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

//Local file dependencies
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner')

//Create new instances
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub});

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//Commented out delay in order to elminate "message received" by root node
//setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

//GET HTTP requests are designed to read data from the backend
app.get('/api/blocks', (req, res) => {
    //res object defines how requests will respond
    res.json(blockchain.chain);
});

//(!!) Cannot GET /api/mine, because we only have get for /api/blocks

//API: POST request for user is going to receive mining data
app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    //Add block to local blockchain instance
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

//API: POST request allowing sender to complete transaction using their wallet
app.post('/api/transact', (req, res) => {
    const {amount, recipient} = req.body;

    //Using 'let' so that transaction is dynamic to entire method
    let transaction = transactionPool.existingTransaction({ inputAdress: wallet.publicKey });

    try {
        if(transaction) {
            transaction.update({senderWallet: wallet, recipient, amount}); 
        } else {
            transaction = wallet.createTransaction({recipient, amount});
        }
    }

    catch(error) {
        //Return res.json ensures that request aborted when error detected
        //Status Code: 400 means 'bad request'
        return res.status(400).json({type: 'error', message: error.message});
    }

    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json({type: 'success', transaction});
});

//API: GET request to be able to get data within transaction pool map
app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
})

//API: GET request to mine transaction
app.get('/api/mine-transactions', () => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
})

//METHOD: Syncs chains from ROOT state 
const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        //Status Code of 200 indicates success
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        // NUANCE: Status code of 200 indicates successful request
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
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
        syncWithRootState();
    }
});