// RPC getAccountState module
// This is called by native/cli/rpc/getAccountState CLI wrapper
// Main Dependency: neon-js
// This talks to an RPC node on the given netowrk and returns account state
// i.e.,
// {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "result": {
//         "version": 0,
//         "script_hash": "0x1179716da2e9523d153a35fb3ad10c561b1e5b1a",
//         "frozen": false,
//         "votes": [],
//         "balances": [
//             {
//                 "asset": "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
//                 "value": "94"
//             }
//         ]
//     }
// }

require('module-alias/register')

const _       = require('underscore')
const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

// TODO: automatic standard option picker abstraction and template
// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.node     // Set RPC node to use (be sure to preface with https://)
// program.address  // Set address or array of addresses to query

exports.run = (config) => {
  let program = {}
  let defly = false
  let arg

  if (config) program = config
  else {
    program.debug = false
    program.node = ''
    program.address = null
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
  }

  if (program.address) arg = program.address

  if (!program.node) {
    print('Please supply a node. You can use src/nodejs/neoscan/cli/get_all_nodes.js to find a list or see monitor.cityofzion.io')
  } else {

    return new Promise((resolve, reject) => {
      const client = neon.default.create.rpcClient(program.node)

      commandWrapper(arg)

      function commandWrapper(runtimeArg) {
        client.getAccountState(runtimeArg).then(response => {
          resolve(response)
        })
      }
    })
  }
}
