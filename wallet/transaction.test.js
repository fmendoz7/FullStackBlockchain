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
                it('returns false and logs and error', () => {
                    //Print an absolutely absurd number for a transaction
                        //Try a different unit test, such as negative currency value, etc.
                        //You are implying there is a limit of sent currency that would be considered nonsuspicious
                    transaction.outputMap[senderWallet.publicKey] = 999999;
                    
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the transaction input signature is invalid', () => {
                describe('and the transaction input signature is invalid', () => {
                    it('returns false and logs and error', () => {
                        //Have different wallet sign the transaction
                        transaction.input.signature = new Wallet().sign('data');
                        
                        expect(Transaction.validTransaction(transaction)).toBe(false);
                        expect(errorMock).toHaveBeenCalled();

                    });
                });
            });
        })
    });

    describe('update()', () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

        describe('the amount is INVALID by attempting to transact more than overall balance', () => {
            it('throws an error', () => {
                expect(() => {
                    transaction.update({
                        senderWallet, 
                        recipient: 'foo',
                        amount: 999999999
                            //Basically use a RIDICULOUSLY LARGE number
                            //Take GREAT NOTE of how much total & circulating supply you will have
                    })
                }).toThrow('ERROR: Amount Exceeds Balance');
            })
        });

        //Throw an error if attempting to pull more funds than available
        describe('the amount is VALID by transacting less than overall balance', () => {
            beforeEach(() => {
                originalSignature = transaction.input.signature;
                originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                nextRecipient = 'next-recipient';
                nextAmount = 50;
    
                //ERRATA: Did NOT have the transaction.update method taking these parameters
                transaction.update({
                    senderWallet,
                    recipient: nextRecipient,
                    amount: nextAmount
                })
            })
    
            it('outputs the amount to the next recipient', () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });
    
            it('subtracts PROPER amount from the original sender output amount', () => {
                expect(transaction.outputMap[senderWallet.publicKey])
                    .toEqual(originalSenderOutput - nextAmount);
                    //Returns NEW OUTPUT for sender's public key
            });
    
            it('maintains a total output that matches the input amount', () => {
                expect(
                    Object.values(transaction.outputMap)
                        .reduce((total, outputAmount) => total + outputAmount)
                ).toEqual(transaction.input.amount);
            });
    
            it('reattempts signature the transaction', () => {
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });

            describe('and another transaction update for the same recipient', () => {
                let addedAmount;

                beforeEach(() => {
                    addedAmount = 80;
                    transaction.update({
                        senderWallet,
                        recipient: nextRecipient,
                        amount: addedAmount
                    });
                });

                it('adds to the recipient amount', () => {
                    expect(transaction.outputMap[nextRecipient])
                        .toEqual(nextAmount + addedAmount);
                })

                //We added 80 to our own account while subtracting 80 from our own, so net of 0
            })
        });
    });
});
