const uuid = require('uuid/v1');
const {verifySignature} = require('../util');
const {REWARD_INPUT, MINING_REWARD} = require('../config')

class Transaction {
    constructor ({senderWallet, recipient, amount, outputMap, input}) {
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap({senderWallet, recipient, amount});
        this.input = input || this.createInput({senderWallet, outputMap: this.outputMap});
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
        if(amount > this.outputMap[senderWallet.publicKey]) {
            //ERRATA: Ensure error descriptions are EXACTLY THE SAME
            throw new Error('ERROR: Amount Exceeds Balance');
        }

        //Edge Case: If account DOESN'T EXIST within outputMap
        if(!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;        }

        //Recipient already exists within outputMap
        else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        //Deduct balance accordingly based on amount sent from transaction
        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - amount;

        //ERRATA: Due to a peculiarity of JS for variables to point to the same object
            //this.outputMap is still pointing to the original object
            //despite the fact that the original object has changed.
            //Not like in C++ or Python, where, you have a separate reference for it 
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

    static rewardTransaction({minerWallet}) {
        return new this({
            input: REWARD_INPUT,
            outputMap: {[minerWallet.publicKey]: MINING_REWARD}
        });
    }
}

module.exports = Transaction;