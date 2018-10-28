// rpc getBlock CLI that calls modules/getBlock from CLI
// Main Dependency: neon-js
// This returns a block

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')
const netutil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const getBlock = require('nodejs_neon-js/modules/getBlock')

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
  .option('-h, --hash [hash]', 'specify the hash of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-i, --index [index]', 'specify the number of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-t, --time', 'Only return time field of last block')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .parse(process.argv);

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
    getBlockWrapper(nodes)
  }).catch (error => {
      console.log('neon-js.getNodesByTallest(): ' + error.message)
  })

} else {
  nodes.push({ "url": program.node })
  getBlockWrapper(nodes)
}

if (program.hash) arg = program.hash
if (program.index) arg = parseInt(program.index)

function getBlockWrapper(nodelist) {
  let runtimeArgs = {
    'debug': defly,
    'node': nodelist[0].url,
    'hash': program.hash,
    'index': program.index,
    'time': program.time ? program.time : false,
    'human': program.Human ? program.Human : false,
    'index': program.index
  }

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  getBlock.run(runtimeArgs).then((r) => {
    dbg.logDeep('\nresult:\n', r)
  })
  .catch (error => {
    console.log('neon-js.getBlockCount(): ' + error.message)
  })
}
