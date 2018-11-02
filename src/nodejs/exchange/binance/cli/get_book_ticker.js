// neoscan get_binance_book
// Best price/qty on the order book for a symbol or symbols.

require('module-alias/register')

const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var cfg       = require('nodejs_config/config.js')
const cmc     = require('nodejs_market/coinmarketcap/get_price.js')
const binance = require('nodejs_exchange/binance/binance-api.js')


function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-s <symbol>')
  .option('-d, --debug', 'Debug')
  .option('-s, --symbol <symbol>', 'Specify the symbol to look its value')
  .parse(process.argv);

if (!program.symbol) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
  binance.debug(true)
}

binance.get_book_ticker(program.symbol).then(result => {
  dbg.logDeep('binance book:  ', result)
})
