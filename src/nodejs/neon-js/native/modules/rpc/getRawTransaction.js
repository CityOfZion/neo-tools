// RPC getRawTransaction module
// This is called by native/cli/rpc/getRawTransaction CLI wrapper
// Main Dependency: neon-js
// This talks to an RPC node on the given netowrk and returns a transaction

require('module-alias/register')

const _       = require('underscore')
const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.node     // Set RPC node to use (be sure to preface with https://)
// program.hash     // Specify the hash of the transaction to fetch, if no hash is provided, will get the most recent
// program.time     // Only return the time field of results
// program.human    // Make dates human-readable

exports.run = (config) => {
  let program = {}
  let defly = false

  if (config) program = config
  else {
    program.debug = false
    program.node = ''
    program.hash = null
    program.time = false
    program.human = false
    program.xstr = 0
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
  }

  if (program.hash) arg = program.hash

  if (!program.node) {
    print('Please supply a node. You can use src/nodejs/neoscan/cli/get_all_nodes.js to find a list or see monitor.cityofzion.io')
  } else {

    return new Promise((resolve, reject) => {
      let result = ''

      const client = neon.default.create.rpcClient(program.node)

      if (!program.hash) { // get the tallest by default
        client.getBestBlockHash().then(response => {
          // if (defly) dbg.logDeep('', response)
          client.getBlock(response).then(response => {
            if (response.tx) {
              let newest = response.tx.length - 1
              let txid = response.tx[newest].txid
              if (txid) {
                commandWrapper(txid.slice(2)) // chop off the '0x'
              }
            } else resolve({})
          })
        })
      } else {
        commandWrapper(arg)
      }

      function commandWrapper(runtimeArg) {
        client.getRawTransaction(runtimeArg, program.xstr).then(response => {
          if (program.human) {
              response.blocktime = new Date(response.blocktime * 1000).toLocaleString()
          }
          if (program.time) {
            result = response.blocktime
            // if (defly) print('result:\n' + result)
            resolve(result)
          }
          else {
            // if (defly) dbg.logDeep('result:\n', response)
            resolve(response)
          }
        })
      }
    })
  }
}
