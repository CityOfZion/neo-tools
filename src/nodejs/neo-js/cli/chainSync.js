// chainSync.js
// CLI module interface to neo-js block synchronizer
// https://github.com/cityofzion/neo-js
// This calls nodejs/neo-js/modules/chainSync.js

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netUtil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const command = require('nodejs_neo-js/modules/chainSync')


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
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-t, --time', 'Only return time field of last block - this does not work with -T option')
  .option('-T, --Txs', 'Only return an array of transactions for the block')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-m, --method [method]', 'Call node with this RPC method, default \'getblockcount\'', 'getblockcount')
  .option('-p, --params [params]', 'Call RPC method with these params, default is blank', '')
  .on('--help', function(){
    print('Note: Currently, arguments that modify the results of an RPC call are NOT IMPLEMENTED.')
    print('      It Is highly recommended to use neo-rpc/client/cli/getNodesByX to find a node to use and then use this programs --node or -n option')
    print('\nFor API /NEO:2.9.0/ See http://docs.neo.org/en-us/node/cli/2.9.0/api.html for a list of method names.')
  })
  .parse(process.argv)


dbg.logDeep('n: ', cfg.getNeoJs())
process.exit()

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

if (!program.node) {
  let options = {
    net: program.Net,
  }
  netUtil.getNodesByPing(options).then(rankedNodes => {
    if (defly) dbg.logDeep(__filename + ': getNodesByPing().rankedNodes: ', rankedNodes)
    nodes = rankedNodes
    commandWrapper(nodes)
  })
  .catch (error => {
    print(__filename + ': ' + error.message)
  })
}
else {
  nodes.push({ "url": program.node })
  commandWrapper(nodes)
}

function commandWrapper(nodelist) {
  let runtimeArgs = {
    'debug': defly,
    'node': nodelist[0].url,
    'method': program.method.toLowerCase(),
    'params': program.params.split(','),
    'time': program.time ? program.time : false,
    'human': program.Human ? program.Human : false,
    'txs': program.Txs ? program.Txs : false
  }

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  command.run(runtimeArgs).then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch (error => {
    print(__filename + ': ' + error.message)
  })
}
