const Block = require('./block');

const block = new Block(Date.now(), 'foo-lastHash', 'bar-hash', 'some data');
console.log(block.toString());
console.log('Block Hash:', Block.blockHash(block));
