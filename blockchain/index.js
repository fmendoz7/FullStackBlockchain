const Block = require('./block');
const Transaction = require('../wallet/transaction');
const {cryptoHash} = require('../util');
const {REWARD_INPUT, MINING_REWARD} = require('../config');

class Blockchain {
    //Blockchain constructor to instantiate genesis block
    constructor() {
        this.chain = [Block.genesis()];
    }

    //Factory method to append additional blocks to chain
    addBlock({data, blockNumber}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data,
            //blockNumber: blockNumber++
        });

        this.chain.push(newBlock);
    }

    validTransactionData({chain}) {
        for (let i=1; i<chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) { 
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) { 
                        console.error('Miner rewards exceed limit');
                        return false; 
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) { 
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } 
                
                else {
                    if(!Transaction.validTransaction(transaction)) {
                        console.error('Invalid Transaction');
                        return false;
                    }
                }
            }
        }

        return true;
    }

    //ERROR: Did not include `static` keyword to call on actual class
        //ERROR: Wanted to use `chain` instead 
    static isValidChain(chain) {
        //ERROR: Did not check genesis block itself 
            //ERROR: Will fail because triple equality will not pass unless same instance
            //COUNTER: To just check content, convert to string
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
        {
            return false;
        };

        //Have for loop that checks if the previous block's hash is equal to the lastHash of current block
        for(let i = 1; i < chain.length; i++)
        {
            //Genesis block check moved to outside the for loop
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
            const realLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            if(lastHash !== realLastHash)
            {
                return false;
            }

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if(hash !== validatedHash) 
            {
                //Immediately breaks and returns false
                return false;
            }

            //Conditional to ensure that difficulty jumps DO NOT exceed 1 
                //Need to include functionality where difficulty drifts towards a MEAN
                //Need to prevent difficulty from being raised too high to prevent network standstill 
            if (Math.abs(lastDifficulty - difficulty) > 1) {
                return false;
            }
        }

        //Basically return true if all conditions pass
        return true;
    }

    replaceChain(paramchain, onSuccess) {
        //REM: Data structure for blockchain is (dynamic) ARRAY of blocks, linked by hashes 
            //Linked-list like structure, but you are also given `indices` in the form of block number
        
        //Chain DOES NOT get replaced if it does NOT follow the conditions for being replaced
        //CHECK: If length of chain is less than the other
        if(paramchain.length <= this.chain.length){
            console.error('ERROR: Incoming chain is LONGER!');
            return;
        }

        //CHECK: If blockchain instance is NOT valid
        if(!Blockchain.isValidChain(paramchain))
        {
            console.error('ERROR: Incoming chain is INVALID!');
            return;
        }

        //onSuccess is a callback method if you make it to a successful chain replacement
        if(onSuccess) {
            onSuccess();
        }
        
        console.log('SUCCESS: Replacing chain with new instance');
        this.chain = paramchain;
    }
}

module.exports = Blockchain;