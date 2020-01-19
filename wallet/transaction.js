const uuid = require('uuid/v1');
const {verifySignature} = require('../util');

class Transaction {
    constructor ({senderWallet, recipient, amount}) {
        this.id = uuid();
        this.outputMap = this.createOutputMap({senderWallet, recipient, amount});
        this.input = this.createInput({senderWallet, outputMap: this.outputMap});
    }

    //Constructor-based methods
    createOutputMap({senderWallet, recipient, amount}) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({senderWallet, outputMap}) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    update({senderWallet, recipient, amount}) {
        this.outputMap[recipient] = amount;

        //Deduct balance accordingly based on amount sent from transaction
        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - amount;

        this.input = this.createInput({senderWallet, outputMap: this.outputMap});
    }

    //Static Factory Method
    static validTransaction(transaction) {
        //: notation basically defines what the input is right away
        //Allows you to define input if you are storing consecutive variables 
        const {input: {address, amount, signature}, outputMap} = transaction;

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        //Check if input amount is contained within all values of outputMap
        //Checks for invalid transactions
        if(amount !== outputTotal) {
            console.error(`Invalid Transaction from ${address}`);
            return false;
        }

        //Checks for invalid signature 
        if(!verifySignature({publicKey: address, data: outputMap, signature})) {
            console.error(`Invalid Signature from ${address}`);
            return false;
        }

        return true;
    }
}

module.exports = Transaction;