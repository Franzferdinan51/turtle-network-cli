const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
const easyTable = require('easy-table');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const timeago = require("timeago.js");


const daemon = new TurtleCoind({
    host: 'public.turtlenode.io'
})

// Grabs coinmarketcap data and output the price of TurtleCoin formatted
function getMarket() {
  const convert = 100000000
  axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
      .then((response) => {
          console.info(`\nCurrent USD Price: $${response.data.data.quotes.USD.price}`)
          console.info(`Current Litoshi Price:    Ł ${(response.data.data.quotes.LTC.price * convert).toFixed(2)}`)
          // Outputs red text if 24hr change is negative, green if 24hr change is positive

          if (response.data.data.quotes.USD.percent_change_24h < 0) {
              console.info(`\n24h price change: ${response.data.data.quotes.USD.percent_change_24h + '%'}`.red)
          } else if (response.data.data.quotes.USD.percent_change_24h > 0) {
              console.info(`24h price change: ${response.data.data.quotes.USD.percent_change_24h}%`.green)
          }

          console.info(`24h Volume: $${response.data.data.quotes.USD.volume_24h.toFixed(2)}`)
          console.info(`Circulating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
      })
      .catch(function(error) {
          console.info(error);
      })
}

// get coinmarketcap data to get circulating supply of TurtleCoin
function getSupply() {
  axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
      .then(function(response) {
          console.info(`\nCirculating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
      })
      .catch(function(error) {
          console.info(error);
      })
}

// Grabs network data from TurtleCoind
function getNetwork() {
  daemon.getInfo()
      .then(function(response) {
          console.info(`\nNetwork block height: ${response.network_height}`);
          console.info(`The current global hashrate is: ${formatBytes(response.hashrate)}`);
          console.info(`Mining difficulty: ${numberWithCommas(response.difficulty)}`);
          console.info(`Client version: ${response.version}`);
      })
      .catch(function(error) {
          console.info(error);
      })
}

// Given a quantity of TRTL, will give you how much it is worth in USD and LTC
function getPrice(qty) {
  const convert = 100000000
  axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
      .then((response) => {
          var trtl_usd = response.data.data.quotes.USD.price
          var trtl_lit = response.data.data.quotes.LTC.price
          console.info(`\nCurrent price: $${trtl_usd} or Ł ${(trtl_lit * convert).toFixed(2)}`)

          if (qty) {
              console.info(`${qty} TRTL is: $${(trtl_usd * qty.replaceAll(",", "")).toFixed(10)}`)
              console.info(`${qty} TRTL is: $${(trtl_lit * qty.replaceAll(",", "")).toFixed(10)} Litecoin`)
          } else {
              console.info('\n' + `You can try "trtl price <amount>" to calculate how much your TRTLs are worth`.red)
          }
      })
      .catch((error) => {
          console.info(error);
      })
}

function getCheckpoints() {
  axios.get('https://api.github.com/repos/turtlecoin/checkpoints')
      .then((updateInfo) => {
        console.log(`\nCheckpoints updated ${timeago().format(updateInfo.data.updated_at)}`)
        console.log(`Download the latest checkpoint from: http://checkpoints.info/`)
      });
}

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
  const asciiFolder = path.join(__dirname, '../ascii/')
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
        t.cell(`Amount`, numberWithCommas(item.amount_out/100))
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
  var hashRegex = /^[a-fA-F0-9]{64}$/i // match letters a-f and 0-9 case-insensitive to length 64
  // Did you even put in a valid hash?
  if(checkRegex(checkHash, hashRegex) == false){ // Cleanse the input
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
                t.cell(`Amount`, numberWithCommas(txArray[0].amount_out/100))
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

function checkRegex(hash, regex) {
  return regex.test(hash)
}


module.exports = {
  getMarket,
  getSupply,
  getNetwork,
  getPrice,
  getCheckpoints,
  numberWithCommas,
  formatBytes,
  grabASCII,
  getPublicNodeStatuses,
  getTransactionPool,
  checkTransactionPool
};
