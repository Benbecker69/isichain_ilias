const Blockchain = require('./blockchain');
const Block = require('./block');

describe("Blockchain", () => {
  let blockchain, blockchain2;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block", () => {
    const data = 'foo';
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it("validates a valid chain", () => {
    blockchain2.addBlock('foo');
    expect(Blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  it("invalidates a chain with a corrupt genesis block", () => {
    blockchain2.chain[0].data = 'corrupt';
    expect(Blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it("invalidates a corrupt chain", () => {
    blockchain2.addBlock('foo');
    blockchain2.chain[1].data = 'tampered';
    expect(Blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  it("replaces the chain with a valid longer chain", () => {
    blockchain2.addBlock('foo');
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  it("does not replace with a shorter or equal chain", () => {
    blockchain.addBlock('foo');
    blockchain.replaceChain(blockchain2.chain);
    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });

  // 🔁 Tests liés au PoW
  it('generates a hash that matches the difficulty', () => {
    const lastBlock = Block.genesis();
    const data = 'test';
    const minedBlock = Block.mineBlock(lastBlock, data);

    expect(minedBlock.hash.substring(0, minedBlock.difficulty))
      .toEqual('0'.repeat(minedBlock.difficulty));
  });

  it('lowers difficulty for a slower block', () => {
    const block = Block.mineBlock(Block.genesis(), 'slow');
    expect(Block.adjustDifficulty(block, block.timestamp + 4000))
      .toEqual(block.difficulty - 1);
  });

  it('raises difficulty for a fast block', () => {
    const block = Block.mineBlock(Block.genesis(), 'fast');
    expect(Block.adjustDifficulty(block, block.timestamp + 1))
      .toEqual(block.difficulty + 1);
  });
});
