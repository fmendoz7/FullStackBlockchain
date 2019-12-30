//Require crypto file
const crypto = require('crypto');

//...inputs in JS allows one to SCALE input and fit accordingly
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    //Applying .sort method allows arguments to be placed in ANY order
        //(!!!) This may have potential repercussions of argument that could be same 'type' being mixed
        //(???) Is it good practice to have the same order regardless?
    hash.update(inputs.sort().join(' '));

    return hash.digest('hex');
};

//Allows exportation of cryptoHash const, NOT the entire file though
module.exports = cryptoHash;