// neoscan get_worth

const neoscan = require('./neoscan/neoscan.js')
const dbg     = require('./debug')
const program = require('commander')
var cfg       = require('./neoscan/config.js')
const _       = require('underscore')
var config    = cfg.load('./config.json')
const cmc     = require('./get_cmc_price.js')


function print(msg) {
  console.log(msg);
}

var address

program
  .version('0.1.0')
  .usage('<address>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --amount <amount>', 'Specify the amount of symbol for which to find value')
  .option('-s, --symbol <symbol>', 'Specify the symbol to look its value')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.symbol || !program.amount) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

neoscan.set_net(program.net)
 cmc.get_price(program.symbol).then(result => {
   print('usd value: '+ result + '\n' + 'net worth for amount:' + result * program.amount)
 })
