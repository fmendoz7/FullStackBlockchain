const Block = require('./block');

class Blockchain {
    //Blockchain constructor to instantiate genesis block
    constructor() {
        this.chain = [Block.genesis()];
    }

    //Factory method to append additional blocks to chain
    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    isValidChain({BlockchainParam}) {
        let masterBool = true;

        //Have for loop that checks if the previous block's hash is equal to the lastHash of current block
        for(var i = 1; i < BlockchainParam.chain.length; i++)
        {
            if(i == 1 && BlockchainParam.chain[i].lastHash == BlockchainParam.chain[0].hash)
            {
                masterBool = true;
            }

            if(BlockchainParam.chain[i].lastHash == BlockchainParam.chain[i-1].hash)
            {
                masterBool = true;
            }

            else
            {
                masterBool = false;
                break;
                    //Break statement ensure `false` is final value for masterBool
            }
        }

        return masterBool;
    }
}

module.exports = Blockchain;