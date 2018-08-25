// node vitals module
// this queries a node and generates a report
//
require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')

const neoscan = require('nodejs_neoscan/neoscan')
const dbg     = require('nodejs_util/debug')


// const dbg     = require('nodejs_util/debug')
// const cmc     = require('nodejs_market/coinmarketcap/get_price')
// const binance = require('nodejs_exchange/binance/binance-api.js')
// var cfg       = require('nodejs_config/config')
//
// var config    = cfg.load('nodejs_config/neoscan.config.json')

function print(msg) {
  console.log(msg);
}



program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-d, --debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use')
  .option('-s, --summary', 'summarizes details like getrawmempool and getpeers to integers instead of lists')
  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

const client = neon.default.create.rpcClient(program.node)

print('node: ' + program.node)

client.getVersion().then(response => {
  dbg.logDeep('getVersion:\nresult:\n', response)
})

client.getPeers().then(response => {
  if (program.summary) {
    print('getPeers connected\nresult:\n' + response.connected.length)
    print('getPeers unconnected\nresult:\n' + response.unconnected.length)
    print('getPeers bad\nresult:\n' + response.bad.length)
  } else dbg.logDeep('getRawMemPool\nresult:\n', response)
})

client.getConnectionCount().then(response => {
  dbg.logDeep('getConnectionCount:\nresult:\n', response)
})

client.getBlockCount().then(response => {
  dbg.logDeep('getBlockCount\nresult:\n', response)
})

client.getRawMemPool().then(response => {
  if (program.summary) {
    print('getRawMemPool\nresult:\n' + response.length)
  } else dbg.logDeep('getRawMemPool\nresult\n', response)
})
