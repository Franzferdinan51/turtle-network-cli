const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
const easyTable = require('easy-table');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

const daemon = new TurtleCoind({
    host: 'public.turtlenode.io'
})

//helper to get number with commas
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//helper transfer kilohashes to mgh
function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1000,
        d = b || 2,
        e = ["Bytes", "KH/s", "MH/s", "GH/s", "TH/s", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

// Outputs a random Integer from min to max (ex. 0-1 if there are 2 elements)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}

// Displays random ASCII text or specific ASCII
function grabASCII(file){
  const asciiFolder = path.join(__dirname, '../turtle-network-cli/ascii/')
  //If there was not a file specified / Default command
  if(file === undefined){
    // For outputting every file in a directory
    fs.readdir(asciiFolder, (err, files) => {
      if (err) throw err;
      var randomFile = fs.readFileSync(path.join(asciiFolder, files[getRandomInt(1, files.length)]), 'utf8');
      console.info(randomFile); // If no error, Join ASCII directory to a filename in the files array and print
    })
  } else {
    // If file is specified, print that out
    var ascii = fs.readFileSync(path.join(asciiFolder, file + ".txt"), 'utf8')
    console.info(ascii)
  }
}

// replaces all commas for trtl worth calculation
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Given a URL, return a promise containing the status of Public Nodes
function getPublicNodeStatuses (url) {
  return new Promise(function (resolve, reject) {
    const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
    const requestPromise = require('request-promise-native')

    function getInfo (node) {
      return new Promise(function (resolve, reject) {
        node.synced = false
        node.info = {}
        new TurtleCoind({host: node.url, port: node.port}).getInfo().then(function (result) {
          node.synced = result.synced
          node.info = result
          return resolve(node)
        }).catch(function () {
          return resolve(node)
        })
      })
    }

    requestPromise({
      url: url,
      json: true
    }).then(function (result) {
      var promises = []
      for (var i = 0; i < result.nodes.length; i++) {
        promises.push(getInfo(result.nodes[i]))
      }

      Promise.all(promises).then(function (nodeResults) {
        return resolve(nodeResults)
      }).catch(function () {
        return reject(new Error('An error occurred'))
      })
    }).catch(function () {
      return reject(new Error('An error occurred'))
    })
  })
}

// Get all transactions in the transaction pool
function getTransactionPool() {
  return daemon.getTransactionPool().then((transactions) => {
    if(transactions != ''){
      var t = new easyTable
      transactions.forEach((item) => {
        t.cell(`Amount`, item.amount_out/100)
        t.cell(`Fee`, item.fee/100)
        t.cell(`Size`, item.size)
        t.cell(`Hash`, item.hash)
        t.newRow()
      })
      console.info(`\n` + t.toString())
    } else {
      console.info("\nNo Transactions to show! Here's a turtle instead!\n") // tx pool empty
      grabASCII('walker') // cute turtles suffice right?
    }
  }).catch((err) => {
    if(err.typeError == undefined){ // As soon as a block arrives, nodes must sync again
      console.info(`\nPublic node may not be synced! Try again.`.red)
    }
  })
}

// Given a specific transaction hash, check if it is confirmed or not
function checkTransactionPool(checkHash) {
  var txArray = []
  // Did you even put in a valid hash?
  if(checkRegex(checkHash) == false){ // Cleanse the input
    console.info(`\nNot a valid hash!`.red) // NO!
  } else { // YES!
    daemon.getTransactionPool().then((transactions) => {// look in the transaction pool, check every transaction for checkHash, then build table
        //Check every element
        for(var i = 0; i < transactions.length; i++){
          if(transactions[i].hash == checkHash){ // At the i'th hash, is it == checkHash
            // Yes, build the table
            var t = new easyTable
            transactions.forEach((item) => {
              if(item.hash == checkHash) {
                txArray.push(item)
                t.cell(`Amount`, txArray[0].amount_out/100)
                t.cell(`Fee`, txArray[0].fee/100)
                t.cell(`Size`, txArray[0].size)
                t.cell(`Hash`, txArray[0].hash)
                t.cell(`Status`, `Unconfirmed`.red)
                t.newRow()
              }
            })
            console.info(`\n` + t.toString())
          }
        }
        if(txArray.length == 0){ // if nothing was pushed to txArray, it's confirmed
          console.info(`\nTransaction Confirmed!`.green)
        }
    }).catch((err) => {
      if(err.typeError == undefined || err.typeError == `ESOCKETTIMEDOUT`){ // if undefined thrown, the transaction is confirmed
        console.info(`\nAn Error occured! Please try again!`.red)
      }
    })
  }
}

function checkRegex(hash) {
  var hashRegex = /^[a-fA-F0-9]{64}$/i // match letters a-f and 0-9 case-insensitive to length 64
  return hashRegex.test(hash)
}


module.exports = {
    numberWithCommas,
    formatBytes,
    grabASCII,
    getPublicNodeStatuses,
    getTransactionPool,
    checkTransactionPool
};
