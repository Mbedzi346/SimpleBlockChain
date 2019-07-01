const SHA256 = require('crypto-js/sha256');
//Block constructor
class Block {
  constructor(data){
    this.hash = "",
    this.height = 0,
    this.body = data,
    this.time = 0,
    this.previousBlockHash = ""
  }
}
class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("Genesis Block"))
  }
  addBlock(newBlock){
    newBlock.height = this.chain.length;
    newBlock.time = new Date().getTime().toString().slice(0, -3) //remove last 3 cha
    if(this.chain.length > 0){
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash
    }
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    this.chain.push(newBlock)
  }
}
//Test
blockchain = new Blockchain();
blockchain.addBlock(new Block("First block"))
blockchain.addBlock(new Block("Second block"))
blockchain.addBlock(new Block("Third block"))

console.log(blockchain.chain)
