//Relevant dependencies listed here
    //All dependencies have `_Dep` notation to note they originate from SEPARATE FILE
    //(!!!)Remember to check what SPECIFICALLY is being exported from EACH FILE, it ranges from specific components to entire file
const Blockchain_Dep = require('./blockchain');
const Block_Dep = require('./block');
const cryptoHash = require('./crypto-hash');

describe('Blockchain', () => {
    let blockchain = new Blockchain_Dep();
        //(!!!)REM: Because we need a NEW blockchain instance each run, change from `static` to `let`

    //When running test suite, ensure you have a NEW blockchain instance BEFORE tests
    beforeEach(() => {
        blockchain = new Blockchain_Dep();
        newChain = new Blockchain_Dep();
            //Created to check if a new blockchain instance has actually been created
    
        originalChain = blockchain.chain;
            //Basically create copy of the original, as we will modify `blockchain` in some tests
            //Temp variable for 3-variable comparison: copy of an original and two comparison variables
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

    //Next test suite
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
                blockchain.addBlock({data: 'Test Data #1'});
                blockchain.addBlock({data: 'Test Data #2'});
                blockchain.addBlock({data: 'Test Data #3'});
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

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];

                    //Set arbitrarily low difficulty
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
                    const badBlock = new Block_Dep({
                        timestamp, lastHash, hash, nonce, difficulty, data
                    });

                    blockchain.chain.push(badBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                })
            });

            describe('and the chain does NOT contain any invalid blocks', () => {
                it('returns true', () => {
                    //Passed all tests and expect to return true
                    expect(Blockchain_Dep.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    //REM: We want to replace with a different chain of the same length
    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            //Quiets terminal output from runs of unit tests
            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is NOT longer than old', () => {
            
            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'};
                blockchain.replaceChain(newChain.chain);
            });
            
            it('does NOT replace the chain', () => {
                //let checkLength = false;

                if(blockchain.length < originalChain.length)
                {
                    return true;
                }

                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the NEW chain is longer', () => {

            //Add new test data for this test suite before each block
            beforeEach(() => {
                newChain.addBlock({data: 'Test Data #1'});
                newChain.addBlock({data: 'Test Data #2'});
                newChain.addBlock({data: 'Test Data #3'});
            });

            describe('and the chain is invalid', () => {
                
                beforeEach(() => {
                    newChain.chain[2].hash = 'test-invalid-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                
                it('does not replace the chain', () => {
                    //Will be invalid, since we forcibly changed the hash for the last block of newChain
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {
                
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                
                it('replaces the chain', () => {
                    //We are not modifying any data, but doing a direct copy of one chain to the next
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs successful chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                })
            });
        });
    });
});