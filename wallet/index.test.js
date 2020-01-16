const Wallet = require('./index');

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
});