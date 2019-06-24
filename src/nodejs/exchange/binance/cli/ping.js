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
  .usage('')
  .option('-D, --Debug', 'Debug')
  .parse(process.argv);


if (program.Debug) {
  print('DEBUGGING');
  binance.debug(true)
}

binance.ping().then(result => {
  dbg.logDeep('ping:  ', result)
})
