// send asset with neon-js
//
// require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')


// const dbg     = require('nodejs_util/debug')
// const cmc     = require('nodejs_market/coinmarketcap/get_price')
// const binance = require('nodejs_exchange/binance/binance-api.js')
// var cfg       = require('nodejs_config/config')
//
// var config    = cfg.load('nodejs_config/neoscan.config.json')

function print(msg) {
  console.log(msg);
}

var address, get_price

program
  .version('0.1.0')
  .usage('-s <symbol> -v <value>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-v, --value <value>', 'Specify the amount of symbol to send')
  .option('-s, --symbol <symbol>', 'Specify the symbol of the currency to send')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.symbol || !program.value) {
  program.help()
}

if (program.exchange) {
  exchange = program.exchange
  if(exchange === 'binance') get_price = binance.get_price
  else get_price = cmc.get_price
}

if (program.debug) {
  print('DEBUGGING');
}


get_price(program.symbol).then(result => {
  if(result) print('usd value: '+ result + '\n' + 'net worth for amount: ' + result * program.amount)
})
