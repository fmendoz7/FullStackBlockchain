const Transaction = require('./transaction');
const Wallet = require('./index');
const {verifySignature} = require('../util');

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-public-key';
        amount = 50;

        transaction = new Transaction({senderWallet, recipient, amount});
    });

    it('has an `id`', () => {
        //toHaveProperty method part of Jest framework
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap', () => {
        it('has an `outputMap`', () => {
            expect(transaction).toHaveProperty('outputMap');
        });
        
        it('outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance for the `senderWallet`', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance-amount);
        });
    });

    describe('input', () => {
        it('has an `input`', () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('has a `timestamp` in the input', () => {
            expect(transaction).toHaveProperty('input');
        });

        it('sets the `amount` to the `senderWallet` balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the `address` to the `senderWallet` publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input', () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true);
        });
    });

    describe('validTransaction()', () => {
        let errorMock;

        //Use inherent jest methods for error detection
        beforeEach(() => {
            errorMock = jest.fn();
            global.console.error = errorMock;
        })
        
        describe('when the transaction is valid', () => {
            it('returns true', () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            })
        });
    
        describe('when the transaction is invalid', () => {
            describe('and a transaction outputMap value is invalid', () => {
                it('returns false', () => {
                    //Print an absolutely absurd number for a transaction
                        //Try a different unit test, such as negative currency value, etc.
                        //You are implying there is a limit of sent currency that would be considered nonsuspicious
                    transaction.outputMap[senderWallet.publicKey] = 999999;
                    
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                });
            });

            describe('and the transaction input signature is invalid', () => {
                describe('and the transaction input signature is invalid', () => {
                    it('returns false', () => {
                        //Have different wallet sign the transaction
                        transaction.input.signature = new Wallet().sign('data');
                        
                        expect(Transaction.validTransaction(transaction)).toBe(false);
                    });
                });
            });
        })
    });
});
