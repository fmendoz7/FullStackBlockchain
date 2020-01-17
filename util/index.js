const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

const ec = new EC('secp256k1');

const verifySignature = ({publicKey, data, signature}) => {
    //Temporary key object, encoded in the hex form
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = {ec, verifySignature, cryptoHash};