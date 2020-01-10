//Correct that you imported static genesis block data from config file
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    //Good coding practice to wrap >= 3 args in map-structure 
    //Coding calls makes a HUGE difference in consistent code calls
        
    constructor({timestamp, lastHash, hash, data, nonce, difficulty, blockNumber}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
        //this.blockNumber = blockNumber;
    }

    //REM: () for methods. Use 'static' keyword instead
    static genesis() {
        //Essentially, place config data for new genesis block data
        return new Block(GENESIS_DATA);
    };

    //Any method NOT using constructor uses 'static' instead
    static mineBlock({lastBlock, data, blockNumber}) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        //blockNumber = lastBlock.blockNumber++;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        //Because value is the same as key, can leave timestamp, lastHash and data as-is
        return new this({timestamp, lastHash, data, difficulty, nonce, hash});
    };

    //Adjusts difficulty based on subsequent appends to blockchain
    static adjustDifficulty({ originalBlock, timestamp }) {
        //difficulty 
        const { difficulty } = originalBlock;

        const difference = timestamp - originalBlock.timestamp;

        if (difference > MINE_RATE) {
            return difficulty - 1;
        }

        //else {
            return difficulty + 1;
        //}
    };
}

//Basically, this allows you to share this file between other files
//It is equivalent to header or file calls in C
module.exports = Block;

//Test-driven development is more efficient
//It gets quality code written more quickly