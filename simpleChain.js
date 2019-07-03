const SHA256 = require('crypto-js/sha256');
var level = require('level') //persistent data store
var db = level('simpleBlockdb', {valueEncoding : 'json'});
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
    this.chain.push(newBlock);
    db.put(newBlock.height, {
      "hash" : newBlock.hash,
      "height" : newBlock.height,
      "body" : [newBlock.body],
      "time" : newBlock.time,
      "previousBlockHash" : newBlock.previousBlockHash
    }, function (err) {
            if (!err)
                console.log("Block successfully added.")
        }
    )


  }
  getBlockHeight(){
    return this.chain.length - 1;
  }
  getBlock(blockHeight){
    return this.chain[blockHeight-1];
  }
    validateBlock(blockHeight){
        let block = this.getBlock(blockHeight);
        let blockHash = block.hash;
        block.hash = '';
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        if (blockHash===validBlockHash) {
            return true;
        } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
        }
    }
    validateChain(){
        let errorLog = [];
        for (var i = 0; i < this.chain.length-1; i++) {
            // validate block
            if (!this.validateBlock(i))errorLog.push(i);
            // compare blocks hash link
            let blockHash = this.chain[i].hash;
            let previousHash = this.chain[i+1].previousBlockHash;
            if (blockHash!==previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
        } else {
            console.log('No errors detected');
        }
    }
    getBlockByHeight(height){
        db.get(height, function (err, block) {
            console.log(block)
        })
    }
}
//Test
blockchain = new Blockchain();
blockchain.addBlock(new Block("First block"))
blockchain.addBlock(new Block("Second block"))
blockchain.addBlock(new Block("Third block"))
console.log(blockchain.getBlockByHeight(2))