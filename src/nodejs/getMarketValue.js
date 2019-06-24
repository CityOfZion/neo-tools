// Get the price of a symbol at a given amount on
// - binance or
// - coinmarketcap
// - coinpaprika
// TODO break these out into binance and cmc respectively also
// TODO lookup ticker names first

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const cmc     = require('nodejs_market/coinmarketcap/get_price')
const coinpap = require('nodejs_market/coinpaprika/api')
const binance = require('nodejs_exchange/binance/binance-api.js')
var cfg       = require('nodejs_config/config')

var config    = cfg.load('nodejs_config/neoscan.config.json')

function print(msg) {
  console.log(msg)
}

var address, symbol

program
  .version('0.1.0')
  .usage('-s [symbol] -a <amount> -x [exchange]')
  .option('-D, --Debug', 'Debug')
  .option('-a, --amount <amount>', 'Specify the amount of symbol for which to find value')
  .option('-s, --symbol [symbol]', 'Specify the symbol to look up its value')
  .option('-x, --exchange [exchange]', 'Specify exchange or api to use to query prices - defaults to coinmarketcap', 'cmc')
  .on('--help', () => {
    print('Note: valid values for -x --exchange are \'binance\', \'coinpaprika\', or none for coinmarketcap.')
  })
  .parse(process.argv);

if (!program.amount) {
  program.help()
}
if (program.Debug) {
  print('DEBUGGING');
  binance.debug()
  cmc.debug()
  coinpap.debug()
}

switch(program.exchange) {
  case "binance":
    binance.get_price(symbol).then(result => {
      if(result && result.symbol && result.price) {
        print(result.symbol +' usd value: ' + result.price + '\n' + 'net worth for amount: ' + result.price * program.amount)
        print('usd value: ' + result.symbol + '\n' + 'net worth fr amount: ' + result.price * program.amount)
      } else if(result && result.length) {
        result.forEach((coin) => {
          print(coin.symbol + ' usd value: ' + coin.price + '\n' + 'net worth for amount: ' + coin.price * program.amount)
        })
      }
    })
    break
  case "coinpaprika":
  if (!program.symbol) symbol = 'neo-neo'
  else symbol = program.symbol
    coinpap.getTicker(symbol).then(result => {
      dbg.logDeep(' ', result)
    })
    break
  default: // coinmarketcap
    if (!program.symbol) symbol = 'NEO'
    else symbol = program.symbol
    cmc.get_price(symbol).then(result => {
      if(result) {
        print(symbol + ' usd value: ' + result + '\n' + 'net worth for amount: ' + result * program.amount)
      }
    })
}
