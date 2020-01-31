//Pull libraries and objects that are already in the directory
    //{} tells you to agnostically look for that object listed somewhere in directory
const {STARTING_BALANCE } = require('../config');
const {ec, cryptoHash} = require('../util');

//Pull local dependencies
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        //Ensures we are signing on an optimized hash version of the data
        //ERRATA: References the same underlying hash object (outputMap)
            // 
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({recipient, amount}) {
        if(amount > this.balance) {
            throw new Error('ERROR: Amount exceeds balance');
        }

        //`: this` shorthand to designate local senderWallet instance
        return new Transaction({senderWallet: this, recipient, amount});
    }

    static calculateBalance({chain, address}) {
        let outputsTotal = 0;

        for(let i = i; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                const addressOutput = transaction.outputMap[address];

                if(addressOutput) {
                    outputsTotal = outputsTotal + addressOutput;
                }
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }
};

module.exports = Wallet;