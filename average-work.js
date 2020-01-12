const Blockchain = require('./blockchain');
const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

//Keep track of timestamps in array
const times = [];

//Upper limit of 10,000 Proof-Of-Work Blocks
for (let i = 0; i < 10000; i++) {

    //Display stats of the most recent block in the chain
    console.log('first block', blockchain.chain[blockchain.chain.length - 1]);

    //Get timestamp of previous block
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    //Iteratively adds blocks
    blockchain.addBlock({ data: `Block ${i}` });

    //Why is it called next block when it refers to block most recently appended to the chain?
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;

    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    //Callback helps calculate average by appending number to growing total
    average = times.reduce((total, num) => (total + num)) / times.length;

    console.log(`Time to mine block #${i}: ${timeDiff} ms. Difficulty: ${nextBlock.difficulty}. Average Time: ${average} ms.`);
}