// node vitals module
// this queries a node and generates a report
//
require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')

const neoscan = require('nodejs_neoscan/neoscan')
const dbg     = require('nodejs_util/debug')


function print(msg) {
  console.log(msg);
}



program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-D, --Debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use')
  .option('-s, --summary', 'summarizes details like getrawmempool and getpeers to integers instead of lists')
  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.Debug) {
  print('DEBUGGING');
  neoscan.debug(true)
}

const client = neon.default.create.rpcClient(program.node)

print('node: ' + program.node)

client.getVersion().then(response => {
  dbg.logDeep('getVersion: ', response)
})

client.getPeers().then(response => {
  if (program.summary) {
    print('getPeers connected ' + response.connected.length)
    print('getPeers unconnected ' + response.unconnected.length)
    print('getPeers bad ' + response.bad.length)
  } else dbg.logDeep('getPeers ', response)
})

client.getConnectionCount().then(response => {
  dbg.logDeep('getConnectionCount: ', response)
})

client.getBlockCount().then(response => {
  dbg.logDeep('getBlockCount ', response)
})

client.getRawMemPool().then(response => {
  if (program.summary) {
    print('getRawMemPool ' + response.length)
  } else dbg.logDeep('getRawMemPool\nresult\n', response)
})
