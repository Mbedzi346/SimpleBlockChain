const SHA256 = require('crypto-js/sha256');
var level = require('level') //persistent data store

var db = level('simpleBlockChain')
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
    db.put('name', newBlock, function(err){
      if(err)
        return console.log(err)
    })
  }
}
//Test
blockchain = new Blockchain();
blockchain.addBlock(new Block("First block"))
blockchain.addBlock(new Block("Second block"))
blockchain.addBlock(new Block("Third block"))
console.log(db.get('a385849a556839f08e797a9bc22f2bb4baa5bf89994369917bc1b4eb9bb79d52'))
//console.log(blockchain.chain)
