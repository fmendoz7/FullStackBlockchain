class TransactionMiner {
    constructor({blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    // (!!!) WARNING: Method currently undefined 
    mineTransactions() {
        
        //get transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransactions();
        
        //generate miner's reward
        validTransactions.push(
            Transactions.rewardTransaction({minerWallet: this.wallet})
        );

        //append block consisting of transactions to blockchain
        this.blockchain.addBlock({data: validTransactions});

        //broadcast updated blockchain
        this.pubsub.broadcastChain();

        //clear pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;