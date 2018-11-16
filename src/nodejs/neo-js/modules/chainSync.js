// chainSync.js
// module interface to neo-js block synchronizer
// https://github.com/cityofzion/neo-js
// This is called by nodejs/neo-js/cli/chainSync.js CLI wrapper

require('module-alias/register')

const _       = require('underscore')

const netUtil = require('nodejs_util/network')
const dbg     = require('nodejs_util/debug')


// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.node     // Set RPC node to use (be sure to preface with https://)
// program.time     // Only return the time field of the last block
// program.human    // Make dates human-readable
// program.Txs      // Only return an array of transactions from the block
// program.method   // This is the RPC method to call
// program.params   // These are the params for the RPC method
// program.net      // This is the network to run on

exports.run = (config) => {
  let program = {}
  let defly = false
  let arg

  if (config) program = config
  else {
    program.debug = false
    program.node = ''
    program.time = false
    program.human = false
    program.txs = false
    program.method = 'getblockcount'
    program.params = ''
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
  }

  if (!program.node) {
    print('Please supply a node. You can use src/nodejs/neoscan/cli/get_all_nodes.js to find a list or see monitor.cityofzion.io')
  } else {

    let result = ''

    let request = {
      "jsonrpc": "2.0",
      "method": program.method,
      "params": program.params,
      "id": 1
    }

    let cfg = {
      headers: { "Content-Type": "application/json" },
      timeout: 30000
    }

    if (defly) {
      dbg.logDeep('url: ', program.node.url)
      dbg.logDeep('request: ', request)
      dbg.logDeep('cfg: ', cfg)
    }
    return new Promise((resolve, reject) => {
      const options = {
        network: 'testnet',
        storageType: 'mongodb',
        storageOptions: {
          connectionString: 'mongodb://localhost/neo_testnet',
        },
      }

      // Create a neo instance
      const neo = new Neo(options)

      // Get block count
      neo.storage.on('ready', () => {
        neo.storage.getBlockCount()
          .then((res) => {
            console.log('Block count:', res)
          })
      })
    })
  }
}
