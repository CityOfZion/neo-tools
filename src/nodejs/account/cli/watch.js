// set an acocunt to be watched and return watched accounts

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const cmc     = require('nodejs_market/coinmarketcap/get_price')
const binance = require('nodejs_exchange/binance/binance-api.js')
var cfg       = require('nodejs_config/config')
var account   = require('nodejs_account/account')


var config    = cfg.load('nodejs_config/neoscan.config.json')

function print(msg) {
  console.log(msg);
}

var address, exchange, get_price

program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')

  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.symbol || !program.amount) {
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


account.get_watch_addresses(program.symbol).then(result => {
  if(result) print('usd value: '+ result + '\n' + 'net worth for amount: ' + result * program.amount)
})
