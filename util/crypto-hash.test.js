const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('foo'))
            .toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
                //ERRATA: New hash (b22132..) takes into account the QUOTES when being passed through JSON.stringify
    });

    it('produces same hash with same input arguments in any order', () => {
        expect(cryptoHash('one','two', 'three'))
            .toEqual(cryptoHash('three', 'one', 'two'))
    });

    //Developed to counter reference to same cryptoHash outputMap bug, despite having synatically same values
    it('produces a UNIQUE hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    })
});