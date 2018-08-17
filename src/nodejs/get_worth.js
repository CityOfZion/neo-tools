// neoscan get_worth

const neoscan = require('./neoscan/neoscan.js')
const dbg     = require('./debug')
const program = require('commander')
var cfg       = require('./neoscan/config.js')
const _       = require('underscore')
var config    = cfg.load('./config.json')
const cmc     = require('./get_cmc_price.js')
const binance = require('./get_binance_price.js')


function print(msg) {
  console.log(msg);
}

var address, exchange, get_price

program
  .version('0.1.0')
  .usage('<address>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --amount <amount>', 'Specify the amount of symbol for which to find value')
  .option('-s, --symbol <symbol>', 'Specify the symbol to look its value')
  .option('-x, --exchange [exchange]', 'Specify exchange or api to use to query prices - defaults to coinmarketcap', 'cmc')
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

neoscan.set_net(program.net)

get_price(program.symbol).then(result => {
  print('usd value: '+ result + '\n' + 'net worth for amount: ' + result * program.amount)
})
