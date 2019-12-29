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
}

//Basically, this allows you to share this file between other files
//It is equivalent to header or file calls in C
module.exports = Block;

//Test-driven development is more efficient
//It gets quality code written more quickly