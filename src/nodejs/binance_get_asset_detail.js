// neoscan get_binance_book
// Best price/qty on the order book for a symbol or symbols.

const dbg     = require('./debug')
const program = require('commander')
var cfg       = require('./config.js')
const _       = require('underscore')
const cmc     = require('./get_cmc_price.js')
const binance = require('./binance.js')


var config = cfg.load('./nodejs.config.json')
var extCfg = cfg.get_exchanges()
// dbg.logDeep('external config: ', extCfg);

function print(msg) {
  console.log(msg);
}

var symbol

program
  .version('0.1.0')
  .usage('-s <symbol>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-s, --symbol [symbol]', 'Specify the symbol to look its value')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (program.symbol) {
  // program.help()
  symbol = program.symbol
}

if (program.debug) {
  print('DEBUGGING');
}

binance.get_asset_detail(extCfg.exchanges.binance.apiKey, extCfg.exchanges.binance.secret, symbol).then(result => {
  dbg.logDeep('asset details: ', result)
})
