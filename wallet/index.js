const {STARTING_BALANCE } = require('../config');
const {ec, cryptoHash} = require('../util');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        //Ensures we are signing on an optimized hash version of the data
        return this.keyPair.sign(cryptoHash(data));
    }
};

module.exports = Wallet;