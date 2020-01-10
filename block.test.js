//Require statement basically accesses another file
const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const { GENESIS_DATA, MINE_RATE } = require('./config');

describe('Block', () => {
    const timestamp = 2000;
        //provide valid millisecond value for timestamp
   const lastHash = 'foo-hash';
   const hash = 'bar-hash';
   const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
   //If key and value are the same, can just call the value outright
   const block = new Block ({
       timestamp,
       lastHash,
       hash,
       data,
       nonce,
       difficulty
        //ERROR: FORGOT TO ADD NONCE AND DIFFICULTY AS PART OF TEST FILE
   });

   it('has a timestamp, lastHash, hash, and data property', () => {
       expect(block.timestamp).toEqual(timestamp);
       expect(block.lastHash).toEqual(lastHash);
       expect(block.hash).toEqual(hash);
       expect(block.data).toEqual(data);
       expect(block.nonce).toEqual(nonce);
       expect(block.difficulty).toEqual(difficulty);
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
            expect(mineBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `Hash` of the lastBlock', () => {
            expect(mineBlock.lastHash).toEqual(lastBlock.hash);
                //Critical for linking block data structures to create block 'chain'
        });

        it('sets the `data`', () => {
            expect(mineBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(mineBlock.timestamp).not.toEqual(undefined);
                //That is a SHIT test. IRL, you'd want to have timestamp increment from previous
        });

        it('creates a SHA-256 `hash` based on proper inputs', () => {
            expect(mineBlock.hash)
                .toEqual(
                cryptoHash(
                    mineBlock.timestamp,
                    mineBlock.nonce,
                    mineBlock.difficulty,
                    lastBlock.hash,
                    data
                )
             );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(mineBlock.hash.substring(0, mineBlock.difficulty))
                .toEqual('0'.repeat(mineBlock.difficulty));
        });
    });

    describe('adjustDifficulty()', () => {

        //Decrease MINE_RATE by 100 ms to INCREASE difficulty by 1 level  
        it('raises the difficulty for a quickly-mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        //Increase MINE_RATE by 100 ms to DECREASE difficulty by 1 LEVEL
        it('lowers the difficulty for a slowly-mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });
    });
});

//Callback functionality written in () => 
//expect() contains the value you're actually checking
//toEqual contains the value you IDEALLY want to check