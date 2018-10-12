// rpc getBlock CLI that calls modules/getBlock from CLI
// Main Dependency: neon-js
// This returns a block

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

const getBlock = require('nodejs_neon-js/modules/getBlock')

let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://)')
  .option('-h, --hash [hash]', 'specify the hash of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-i, --index [index]', 'specify the number of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-t, --time', 'Only return time field of last block')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  // TODO move all -n args to -N for network
  .parse(process.argv);

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

if (!program.node) {
  // get a node from the list and try it
  let net = netutil.resolveNetworkId(program.Net)

  dbg.logDeep('nets: ', cfg.get_nodes(net))

} else node = program.node

if (program.hash) arg = program.hash
if (program.index) arg = parseInt(program.index)

let runtimeArgs = {
  'debug': defly,
  'node': node,
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
