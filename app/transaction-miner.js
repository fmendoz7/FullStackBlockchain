class TransactionMiner {
    constructor({blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions() {
        //get transaction pool's valid transactions
    
        //generate miner's reward 

        //append block consisting of transactions to blockchain

        //broadcast updated blockchain

        //clear pool
    }
}

module.exports = TransactionMiner;