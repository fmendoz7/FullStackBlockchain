//Essentially, config.js is where you store hard-coded and global values

//1000 ms for the generation of every new block
const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
    address: '*authorized-reward*'
};

//Miner will receive 50 coins
const MINING_REWARD = 50;

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

module.exports = {
    GENESIS_DATA, 
    MINE_RATE, 
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};
    //In this instance, we are exporting sample data to be used in all genesis blocks