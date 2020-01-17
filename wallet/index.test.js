const Wallet = require('./index');
const {verifySignature} = require('../util');

describe('Wallet', () => {
    let wallet;

    //Create a new wallet instance before each run
    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey`', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () => {
        const data = 'foobar';

        //Valid signature test due to being signed by original wallet
        it('verifies a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true);
        });

        //Invalid signature test due to different wallet than original
        it('does not verify an invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                        //Signature occurred from a DIFFERENT wallet
                })
            ).toBe(false);
        });
    })
});