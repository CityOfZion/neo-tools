// getNodesByX
// Get a list of RPC nodes based on the given criteria

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netutil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const command = require('nodejs_neo-rpc/v2.9.0/client/module/neo-rpc')


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
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-m, --method [method]', 'Get nodes by the given criteria, default is ping', 'getNodesByPing')
  .on('--help', function(){
    print('Note: -m --method options are: "getNodesByPing", "getNodesByTallest", "getNodesByConnections", getNodesByVersion')
  })
  .parse(process.argv)

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netutil.debug()
}

let options = {
  net: program.Net,
}

netutil[program.method](options).then(rankedNodes => {
  if (defly) dbg.logDeep(__filename + ': getNodesByPing().rankedNodes: ', rankedNodes)
  nodes = rankedNodes
  dbg.logDeep(' ', nodes)
})
.catch (error => {
  print(__filename + ': ' + error.message)
})
