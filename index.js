const easyTable = require('easy-table');
const help = require('./helpers/helpers.js');

const market = () => {
    help.getMarket()
}


const supply = () => {
  help.getSupply()
}


const network = () => {
  help.getNetwork()
}


const ascii = (a) => {
  help.grabASCII(a)
}


const price = (qty) => {
  help.getPrice(qty)
}


const checkpoints = () => {
  help.getCheckpoints()
}

// Gets the status of all public nodes on the nodes-json list
const nodes = () => {
  help.getPublicNodeStatuses('https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json')
    .then((response) => {
      var t = new easyTable

      response.forEach((item) => {
        t.cell('Node', item.name)
        t.cell('URL', item.url)
        t.cell('Port', item.port)
        t.cell('SSL', item.ssl ? "Yes" : "No")
        t.cell('Synced', item.synced ? "Yes".green : "No".red)
        t.newRow()
      })
      t.sort()
      console.info(`\n` + t.toString())
    })
    .catch((err) => {
      console.info(err)
    })
}

const pools = () => {
  help.getPoolsStats().then((poolInfo) => {
    var poolStats = []
    for(var i = 0; i < poolInfo.length; i++) {
        poolStats.push(poolInfo[i])
        console.info(poolInfo[i]) // info pushed to poolStats array
    }


    // Get all the miner #s of forknote pools
    /*for(var i = 0; i < poolStats.length; i++) {
      if(poolStats[i].type == "forknote") {
          console.info(poolStats[i].stats.pool.miners)
      }
    }*/
  }).catch((err) => {
    console.info(err)
  })
}

const transaction = (hash) => {
  if(hash == undefined) {
    help.getTransactionPool()
  } else {
    help.checkTransactionPool(hash)
  }
}

// Export All Methods
module.exports = {
    market,
    supply,
    network,
    price,
    ascii,
    checkpoints,
    nodes,
    pools,
    transaction
}
