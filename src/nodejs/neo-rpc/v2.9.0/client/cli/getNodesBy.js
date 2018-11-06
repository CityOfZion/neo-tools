// getNodesByX
// Get a list of RPC nodes based on the given criteria

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netUtil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const getNodesBy = require('nodejs_neo-rpc/v2.9.0/client/module/getNodesBy')


let nodes = []
let defly = false
let arg

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --node [node]', 'Set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-m, --method [method]', 'Get nodes by the given criteria, default is ping', 'ping')
  .option('-o, --order [order]', 'Order by \'asc\' (ascending <- default) or \'dsc\' (descending)', 'asc')
  .on('--help', function(){
    print('Note: -m --method options are: "ping", "tallest", "connection", "version", "rawMemPool"')
  })
  .parse(process.argv)

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

let options = {
  net: program.Net,
  order: program.order
}

if (program.node) options.nodes = [{ 'url': program.node }]

getNodesBy[program.method.toLowerCase()](options).then(rankedNodes => {

  if (defly) dbg.logDeep(__filename + ': getNodesByPing().rankedNodes: ', rankedNodes)
  nodes = rankedNodes
  dbg.logDeep(' ', nodes)
})
.catch (error => {
  print(__filename + ': ' + error.message)
})
