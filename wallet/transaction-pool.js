const Transaction = require('./transaction');

//Transaction pool object responsible for transaction records across all ledger instances
class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    clear() {
        this.transactionMap = {}
    }

    //setTransaction factory method sets value to transactionMap
    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    //existingTransaction factory method returns list of transactions from specified address
    existingTransaction({inputAddress}) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    //validTransactions factory method returns valid transactions 
    validTransactions() {
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        );
    }

    //clearBlockchainTransactions factory method clears all transactions
    clearBlockchainTransactions({chain}) {
        //For loop to iterate through each block within each chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            //Nested for-loop to iterate through each transaction within each block
            for(let transaction of block.data) {
                if(this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = TransactionPool;