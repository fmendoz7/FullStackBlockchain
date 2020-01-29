const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    // Set transactionPool and transaction should be set to proper instances
    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet, 
            recipient: 'fake-recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            // .toBe ensures that you are checking the ORIGINAL instance in Jest
            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);
        
            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });

    describe('validTransaction()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            //Iterate through loop to instantiate new transactions 
            for(let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 30
                });

                //If divisible by 3, invalidate by having unacceptably obscene amount of currency
                if(i%3===0) {
                    transaction.input.amount = 999999;
                }

                //If divisble by 2, invalidate by having different wallet sign transaction
                else if (i%3 ===1) {
                    transaction.input.signature = new Wallet.sign('foo')
                }

                //Else, push a VALID transaction
                else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction)
            }

            it('returns valid transactions', () => {
                expect(transactionPool.validTransactions()).toEqual(validTransactions);
            })

            it('logs errors for invalid transactions', () => {
                transactionPool.validTransactions();
                expect(errorMock).toHaveBeenCalled();
            })
        })
    })

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        })
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing blockchain transactions', () => {
            const blockchain = new Blockchain();
            const expectedTransaction = {}

            for(let i=0; i<6; i++)
            {
                const transaction = new Wallet().createTransaction({
                    recipient: 'foo',
                    amount: 20
                });

                transactionPool.setTransaction(transaction);
                
                if(i % 2 === 0) {
                    blockchain.addBlock({data: [transaction]})
                } else {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockchainTransactions({chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});