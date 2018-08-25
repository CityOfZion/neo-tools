// rpc getconnection count in neon-js
// Gets the current number of connections for the node
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
  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

const client = neon.default.create.rpcClient(program.node)
client.getConnectionCount().then(response => {
  dbg.logDeep('result\n:', response)
})
