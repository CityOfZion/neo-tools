// rpc query in neon-js
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

let args

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-d, --debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use')
  .option('-m, --method <method>', 'set RPC method to use')
  .option('-p, --parms [parms]', 'set string of arguments rpc method parms (comma-separated, no spaces "arg0,..,argN")')
  .parse(process.argv)

if (!program.node || !program.method) {
  program.help()
}
if (program.parms) {
  let s = program.parms
  dbg.logDeep('args: ', s)
  args = s.split(',')
  dbg.logDeep('args: ', args)
}

if (program.debug) {
  print('DEBUGGING');
  console.print('program.node: '+program.node+'\nprogram.method: '+'\nprogram.args: '+program.args)
}


// dbg.logDeep('neon: ',neon)

// const query = neon.Query({method: program.method, params: args})
const query = neon.default.create.query({method: program.method, params: args})
query.execute(program.node).then(response => {
  dbg.logDeep('result\n:', response)
})
