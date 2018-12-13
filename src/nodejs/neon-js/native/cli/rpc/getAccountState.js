// RPC getAccountState CLI
// This calls native/modules/rpc/getAccountState from CLI
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

// TODO: add multiple address option support project-wide

require('module-alias/register')


const program     = require('commander')
const _           = require('underscore')

const neon        = require('@cityofzion/neon-js')
const dbg         = require('nodejs_util/debug')
const netUtil     = require('nodejs_util/network')
const getNodesBy  = require('nodejs_neo-rpc/v2.9.0/client/module/getNodesBy')


var cfg           = require('nodejs_config/config.js')
var config        = cfg.load('nodejs_config/nodejs.config.json')

const command     = require('nodejs_neon-js/native/modules/rpc/getAccountState')

let nodes = []
let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-a, --address [address]', 'Specify the address for the inquiry')
  .option('-n, --node [node]', 'Set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-x, --xstr', 'Return hexstring transactoin value instead of default json', 1)
  .option('-t, --time', 'Only return time field of results')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .on('--help', function(){
  })
  .parse(process.argv)

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

if (!program.address) {
  // check for a default address in config, if not pressent show help
  var default_account = cfg.getDefaultAccount()

  if(default_account) address = default_account.address
  else program.help()
} else {
  address = program.address
}

if (defly) print('address: ' + address)

if (!program.node) {
  // get a node from the list and try it
  // TODO: move node automatic selection into a standard, reusable location (netUtil?)
  let net = netUtil.resolveNetworkId(program.Net)

  nodes = cfg.getNodes(net)

  if (defly) dbg.logDeep('config nodes: ', nodes)

    let options = {
      net: net,
      order: 'asc',
      nodes: nodes
    }

  getNodesBy.tallest(options).then(rankedNodes => {
    if (defly) dbg.logDeep('sorted nodes: ', rankedNodes)
    nodes = rankedNodes
    commandWrapper(nodes)
  }).catch (error => {
      print('neon-js.getNodesByTallest(): ' + error.message)
  })

} else {
  nodes.push({ "url": program.node })
  commandWrapper(nodes)
}

function commandWrapper(nodelist) {
  let runtimeArgs = {
    'Debug': defly,
    'node': nodelist[0].url,
    'address': address,
  }

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  command.run(runtimeArgs).then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch (error => {
    print(__filename + ': ' + error.message)
  })
}
