// RPC getRawTransaction CLI that calls native/modules/rpc/getRawTransaction from CLI
// Main Dependency: neon-js
// This talks to an RPC node on the given netowrk and returns a transaction

// IMPORTANT OPTIMIZATION NOTE: The only difference in the return value of getRawTransaction versus getBlock is three fields more in the former:
// blockhash, confirmations, and blocktime.  Don't make the extra RPC call to getRawTransaction if you don't need to.

// TODO: extension? Get nth transaction

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')
const netutil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const command = require('nodejs_neon-js/native/modules/rpc/getRawTransaction')

let nodes = []
let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-h, --hash [hash]', 'specify the hash of the transaction to fetch, if no hash is provided, will get the most recent')
  .option('-t, --time', 'Only return time field of results')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .on('--help', function(){
    print('OPTIMIZATION NOTE: \n\nThe only difference in the return value of getRawTransaction versus getBlock is three fields more in the former: blockhash, confirmations, and blocktime. Don\'t make the extra RPC call to getRawTransaction if you don\'t need to.')
  })
  .parse(process.argv)



if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netutil.debug()
}

if (!program.node) {
  // get a node from the list and try it
  let net = netutil.resolveNetworkId(program.Net)

  nodes = cfg.get_nodes(net)

  if (defly) dbg.logDeep('config nodes: ', nodes)

  // TODO: look at if dynamic node selection should happen here or in the module

  netutil.getNodesByTallest(nodes).then(rankedNodes => {
    if (defly) dbg.logDeep('sorted nodes: ', rankedNodes)
    nodes = rankedNodes
    commandWrapper(nodes)
  }).catch (error => {
      console.log('neon-js.getNodesByTallest(): ' + error.message)
  })

} else {
  nodes.push({ "url": program.node })
  commandWrapper(nodes)
}

if (program.hash) arg = program.hash

function commandWrapper(nodelist) {
  let runtimeArgs = {
    'debug': defly,
    'node': nodelist[0].url,
    'hash': program.hash,
    'time': program.time ? program.time : false,
    'human': program.Human ? program.Human : false,
  }

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  command.run(runtimeArgs).then((r) => {
    dbg.logDeep('\nresult:\n', r)
  })
  .catch (error => {
    console.log('neon-js.getBlockCount(): ' + error.message)
  })
}
