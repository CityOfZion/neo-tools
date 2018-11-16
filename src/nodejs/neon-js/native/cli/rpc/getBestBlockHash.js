// rpc getBestBlockHash in neon-js
// Get the latest block hash.
// hash of the block

require('module-alias/register')


const program     = require('commander')
const _           = require('underscore')

const neon        = require('@cityofzion/neon-js')
const dbg         = require('nodejs_util/debug')
const netUtil     = require('nodejs_util/network')
const getNodesBy  = require('nodejs_neo-rpc/v2.9.0/client/module/getNodesBy')

var cfg           = require('nodejs_config/config.js')
var config        = cfg.load('nodejs_config/nodejs.config.json')

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
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')

  .parse(process.argv);

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

if (!program.node) {
  // get a node from the list and try it
  let net = netUtil.resolveNetworkId(program.Net)

  nodes = cfg.getNodes(net)

  let options = {
    net: net,
    order: 'asc',
    nodes: nodes
  }

  if (defly) dbg.logDeep('config nodes: ', nodes)

  getNodesBy.tallest(options).then(rankedNodes => {
    if (defly) dbg.logDeep('sorted nodes: ', rankedNodes)
    nodes = rankedNodes
    getBestBlockHash(nodes)
  })

} else {
  nodes.push(program.node)
  getBestBlockHash(nodes)
}

function getBestBlockHash(nodelist) {
  const client = neon.default.create.rpcClient(nodelist[0].url)

  client.getBestBlockHash().then(response => {
    dbg.logDeep(' ', response)
  })
}
