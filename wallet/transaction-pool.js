//Transaction pool object responsible for transaction records across all ledger instances
class TransactionPool {
    constructor() {
        this.transactionMap = {

        };
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
}

module.exports = TransactionPool;