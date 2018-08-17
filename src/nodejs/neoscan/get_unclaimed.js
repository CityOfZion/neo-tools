// neoscan get_unclaimed

const neoscan = require('./neoscan.js')
const dbg     = require('../debug')
const program = require('commander')
var cfg       = require('../config.js')
const _       = require('underscore')
var config    = cfg.load('./nodejs.config.json')

function print(msg) {
  console.log(msg);
}

var address

program
  .version('0.1.0')
  .usage('<address>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address <address>', 'Specify the address for for unclaimed gas inquiry')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.address) {
  // check for a default address in config, if not pressent show help
  var default_account = cfg.get_default_account()

  if(default_account) address = default_account.address

  else program.help()
} else {
  address = program.address
}

if (program.debug) {
  print('DEBUGGING');
}

neoscan.set_net(program.net)

neoscan.get_unclaimed(address).then(result => {
 print(result)
})
