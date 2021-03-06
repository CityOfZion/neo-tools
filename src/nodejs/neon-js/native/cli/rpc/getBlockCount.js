// rpc getBlockCount in neon-js
// This Query returns the current block height.

require('module-alias/register')


const program     = require('commander')
const _           = require('underscore')

const neon        = require('@cityofzion/neon-js')
const dbg         = require('nodejs_util/debug')
const netUtil     = require('nodejs_util/network')
const getNodesBy  = require('nodejs_rpc-over-https/v2.9.0/client/module/getNodesBy')

var cfg           = require('nodejs_config/config.js')
var config        = cfg.load('nodejs_config/nodejs.config.json')

let nodes  = []
let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')

  .parse(process.argv);

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

if (!program.node) {
  // get a node from the list and try it
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
    getBlockCount(nodes)
  })

} else {
  nodes.push({ 'url': program.node })
  getBlockCount(nodes)
}

function getBlockCount(nodelist) {
  const client = neon.default.create.rpcClient(nodelist[0].url)

  client.getBlockCount().then(response => {
    dbg.logDeep(' ', response)
  })
  .catch (error => {
    console.log(__filename + ': ' + error.message)
  })
}
