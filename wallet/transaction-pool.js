//Transaction pool object responsible for transaction records across all ledger instances
class TransactionPool {
    constructor() {
        this.transactionMap = {

        };
    }

    //setTransaction factory method sets value to transactionMap
    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    //existingTransaction factory method returns list of transactions from specified address
    existingTransaction({inputAddress}) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(transaction => transaction.input.address === inputAddress);
    }
}

module.exports = TransactionPool;