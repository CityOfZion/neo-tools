// neoscan get_last_transactions_by_address

const neoscan = require('./neoscan.js')
const dbg     = require('../debug')
const program = require('commander');
var cfg       = require('../config.js')
const _       = require('underscore')
var config    = cfg.load('./nodejs.config.json')

function print(msg) {
  console.log(msg);
}

let pageArg = ''
var address

program
  .version('0.1.0')
  .usage('<address> [page]')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address <address>', 'Specify the address for balance inquiry')
  .option('-p, --page [page]', 'Show last stransactions for <address> starting at [page]')
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

if (program.page)  {
  pageArg = program.page
}

if (program.debug) {
  print('DEBUGGING');
}


neoscan.set_net(program.net)
 neoscan.get_last_transactions_by_address(address, pageArg).then(result => {
   print(result)
 })
