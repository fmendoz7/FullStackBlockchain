//Correct that you imported static genesis block data from config file
const {GENESIS_DATA} = require('./config');

class Block {
    //Good coding practice to wrap >= 3 args in map-structure 
    //Coding calls makes a HUGE difference in consistent code calls
    
    //Let's try to implement this logic ourselves
    
    constructor({timestamp, lastHash, hash, data}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    //REM: () for methods. Use 'static' keyword instead
    static genesis() {
        //Essentially, place config data for new genesis block data
        return new Block(GENESIS_DATA);
    };

    //Any method NOT using constructor uses 'static' instead
    static mineBlock({lastBlock, data}) {
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data
        });
    };
}

//Basically, this allows you to share this file between other files
//It is equivalent to header or file calls in C
module.exports = Block;

//Test-driven development is more efficient
//It gets quality code written more quickly