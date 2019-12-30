//Relevant dependencies listed here
    //All dependencies have `_Dep` notation to note they originate from SEPARATE FILE
    //(!!!)Remember to check what SPECIFICALLY is being exported from EACH FILE, it ranges from specific components to entire file
const Blockchain_Dep = require('./blockchain');
const Block_Dep = require('./block');

describe('Blockchain', () => {
    let blockchain = new Blockchain_Dep();
        //(!!!)REM: Because we need a NEW blockchain instance each run, change from `static` to `let`

    //When running test suite, ensure you have a NEW blockchain instance BEFORE tests
    beforeEach(() => {
        blockchain = new Blockchain_Dep();
    })

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        //Apply genesis() on Block object to get genesis block
        //Ensure equality between first block and this one
        expect(blockchain.chain[0]).toEqual(Block_Dep.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'fake-genesis'};
                    //In production, replace data payload with something else

                expect(Blockchain_Dep.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when chain starts with genesis block and has multiple blocks', () => {
            
            //If you want to reuse same data/attributes for tests, include in `beforeEach()` block
            beforeEach(() => {
                //Sample data payload. Will change in production, ideally as hashmap-like structure.
                blockchain.addBlock({data: 'Bears'});
                blockchain.addBlock({data: 'Beets'});
                blockchain.addBlock({data: 'Battlestar Galactica'});
            })
            
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    //Change hash of last block (index 2) to invalidate block lastHash and break blockchain
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain_Dep.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and chain contains block with invalid field', () => {
                it('returns false', () => {
                    //Change data of last block to be invalid from expected
                    blockchain.chain[2].data = 'invalid-data';
                    expect(Blockchain_Dep.isValidChain(blockchain.chain)).toBe(false);
                        //Automatically changed it as false because we know it deviates from expected
                        //In production, you cannot really predict contents of actual data payload (aside from lastHash, timestamp, etc.)
                })
            });

            describe('and the chain does NOT contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain_Dep.isValidChain(blockchain.chain)).toBe(false);
                });
            });
        });
    });
});