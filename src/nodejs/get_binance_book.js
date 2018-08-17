// neoscan get_binance_book
// Best price/qty on the order book for a symbol or symbols.

const dbg     = require('./debug')
const program = require('commander')
var cfg       = require('./neoscan/config.js')
const _       = require('underscore')
var config    = cfg.load('./config.json')
const cmc     = require('./get_cmc_price.js')
const binance = require('./binance.js')


function print(msg) {
  console.log(msg);
}

var address, exchange, get_price

program
  .version('0.1.0')
  .usage('-s <symbol>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-s, --symbol <symbol>', 'Specify the symbol to look its value')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.symbol) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

binance.get_book(program.symbol).then(result => {
  dbg.logDeep('binance book: ', result)
})
