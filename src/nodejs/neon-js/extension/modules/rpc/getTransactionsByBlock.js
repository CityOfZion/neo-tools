// RPC getTransactionsByBlock module
// This is called by native/cli/rpc/getTransactionsByBlock CLI wrapper
// Main Dependency: neon-js
//
// This returns an array oftransactions for a given block.
// The block can be chosen by hash or index.
// If no hash or index is provided the highest block is used.

require('module-alias/register')

const _       = require('underscore')
const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

// Pass an object named config of the following format to control module behavior
// program.Debug    // Toggle debugging
// program.node     // Set RPC node to use (be sure to preface with https://)
// program.hash     // Specify the hash of the block to fetch, if no hash or index is supplied will get the tallest
// program.time     // Only return the time field of the last block
// program.human    // Make dates human-readable
// program.index    // specify the number of the block to fetch, if no hash or index is supplied will get the tallest
// TODO add transaction limit
// TODO json blockreader: dump json blocks on stdin
// TODO start reading at a block and don't stop fetching transactions until there are no more blocks

exports.run = (config) => {
  let program = {}
  let defly = false

  if (config) program = config
  else {
    program.Debug = false
    program.node = ''
    program.hash = null
    program.time = false
    program.human = false
    program.index = 0
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.Debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
  }

  if (program.hash) arg = program.hash
  if (program.index) arg = parseInt(program.index)

  if (!program.node) {
    print('Please supply a node. You can use src/nodejs/neoscan/cli/get_all_nodes.js to find a list or see monitor.cityofzion.io')
  } else {

    return new Promise((resolve, reject) => {
      let result = ''

      const client = neon.default.create.rpcClient(program.node)

      if (!program.hash && !program.index) { // get the tallest by default
        client.getBestBlockHash().then(response => {
          // if (defly) dbg.logDeep('', response)

          commandWrapper(response)
        })
      } else {
        commandWrapper(arg)
      }

      function commandWrapper(runtimeArg) {
        client.getBlock(runtimeArg).then(response => {
          if (program.human) {
              response.time = new Date(response.time * 1000).toLocaleString()
          }
          if (program.time) {
            result = response.time
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
