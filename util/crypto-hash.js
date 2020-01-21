//Require crypto file
const crypto = require('crypto');

//...inputs in JS allows one to SCALE input and fit accordingly
const cryptoHash = (...inputs) => {
    //Essentially, hash ALL the inputs put into dynamic array
    const hash = crypto.createHash('sha256');

    //Applying .sort method allows arguments to be placed in ANY order
        //(!!!) This may have potential repercussions of argument that could be same 'type' being mixed
        //(???) Is it good practice to have the same order regardless?

    //ERRATA: Now, must account for double quotes when passing through stringify, as getting different hash
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    //Wrap hashes in hexToBinary library to get BINARY hashes for difficulty adjustment
    //return hexToBinary(hash.digest('hex'));

    return hash.digest('hex');
};

module.exports = cryptoHash;