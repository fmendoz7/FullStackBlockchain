//Essentially, config.js is where you store hard-coded and global values

//variables in all caps represents hard-coded objects
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '----',
    hash: 'hash-one',
    data: [],
    //blockNumber: 1
}; 

module.exports = {GENESIS_DATA};
    //In this instance, we are exporting sample data to be used in all genesis blocks