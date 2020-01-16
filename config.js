//Essentially, config.js is where you store hard-coded and global values

const MINE_RATE = 1000;
    //1000 ms for the generation of every new block
const INITIAL_DIFFICULTY = 3;

const STARTING_BALANCE = 1000;

//variables in all caps represents hard-coded objects
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '----',
    hash: 'hash-one',
    data: [],
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    //blockNumber: 1
}; 

module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE};
    //In this instance, we are exporting sample data to be used in all genesis blocks