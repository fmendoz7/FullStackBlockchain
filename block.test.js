//Require statement basically accesses another file
const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const {GENESIS_DATA} = require('./config');

describe('Block', () => {
   const timestamp = 'a-date';
   const lastHash = 'foo-hash';
   const hash = 'bar-hash';
   const data = ['blockchain', 'data'];
   
   //If key and value are the same, can just call the value outright
   const block = new Block ({
       timestamp,
       lastHash,
       hash,
       data
   });

   it('has a timestamp, lastHash, hash, and data property', () => {
       expect(block.timestamp).toEqual(timestamp);
       expect(block.lastHash).toEqual(lastHash);
       expect(block.hash).toEqual(hash);
       expect(block.data).toEqual(data);
   });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        //console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });

    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const mineBlock = Block.mineBlock({lastBlock, data});
    
        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `Hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
                //Critical for linking block data structures to create block 'chain'
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
                //That is a SHIT test. IRL, you'd want to have timestamp increment from previous
        });

        it('creates a SHA-256 `hash` based on proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    });
});

//Callback functionality written in () => 
//expect() contains the value you're actually checking
//toEqual contains the value you IDEALLY want to check