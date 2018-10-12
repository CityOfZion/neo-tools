// rpc getBlock module
// This is called by cli/rpc/getBlock CLI wrapper
// Main Dependency: neon-js
// This returns a block

require('module-alias/register')

const _       = require('underscore')
const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.node     // Set RPC node to use (be sure to preface with https://)
// program.hash     // Specify the hash of the block to fetch, if no hash or index is supplied will get the tallest
// program.time     // Only return the time field of the last block
// program.human    // Make dates human-readable
// program.index    // specify the number of the block to fetch, if no hash or index is supplied will get the tallest


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
    program.index = 0
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.debug) {
    print('DEBUGGING')
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
          if (defly) dbg.logDeep('', response)

          getBlock(response)
        })
      } else {
        getBlock(arg)
      }

      function getBlock(runtimeArg) {
        client.getBlock(runtimeArg).then(response => {
          if (program.Human) {
              response.time = new Date(response.time * 1000).toLocaleString()
          }
          if (program.time) {
            result = response.time
            if (defly) print('result:\n' + result)
            resolve(result)
          }
          else {
            if (defly) dbg.logDeep('result:\n', response)
            resolve(response)
          }
        })
      }
    })
  }
}
