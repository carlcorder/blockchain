/*
Blockchain implementation in Node
https://enlight.nyc/blockchain#project
*/

const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(index, data, previousHash = '') {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data.toString();
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            `${this.index}${this.previousHash}${this.timestamp}${this.data}${this.nonce}`
        ).toString();
    }

    mineBlock(difficulty) {
        const zeros = '0'.repeat(difficulty);
        while (this.hash.substring(0, difficulty) !== zeros) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined : ${this.hash}`);
    }

}

class Blockchain {

    constructor(genesis = new Block(0, 'Genesis block'), difficulty = 4) {
        this.chain = [genesis];
        this.difficulty = difficulty;
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.chain.slice(-1).pop().hash;
        newBlock.mineBlock(this.difficulty);
        // TODO
        // 1) only push newBlocks if mined
        // 2) alert other miners to update previousHash
        this.chain.push(newBlock);
    }

    validateChain() {
        // TODO
        // 1) validate chain after every newBlock
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            return (currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash) ? false : true;
        }
    }

}

let chain = new Blockchain();

console.log('Mining block...');
chain.addBlock(new Block(1, "Block 1"))

console.log('Mining block...');
chain.addBlock(new Block(2, 'Block 2'))

// log chain & validity
console.log(JSON.stringify(chain, null, 2));
console.log(`Valid chain : ${chain.validateChain().toString()}`)
