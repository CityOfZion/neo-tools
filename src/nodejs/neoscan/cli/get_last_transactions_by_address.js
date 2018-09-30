// neoscan get_last_transactions_by_address

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')
var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg)
}

let argus = process.argv

let pageArg = ''
let address

program
  .version('0.1.0')
  .usage('<address> [page]')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address <address>', 'Specify the address for balance inquiry')
  .option('-p, --page [page]', 'Show last stransactions for <address> starting at [page]')
  .option('-t, --time', 'Only return time field of last transactions')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-i, --index [index]', 'Only get last transactions up to i', 0)
  // TODO reverse sort order
  // summarize transaction - show amount of last n txs or similar
  .parse(argus)

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
  print('DEBUGGING')
  neoscan.debug(true)
}



neoscan.configure({ transaction_limit: program.index, human_dates: program.Human })

neoscan.set_net(program.net)
 neoscan.get_last_transactions_by_address(address, pageArg).then(result => {
   if (program.time && result && result.data && result.data.time) {
     if (program.Human) print('\nresult:\n{ "last_transaction_time": "' + new Date(result.data.time * 1000).toLocaleString() + '" }')
     else print('\nresult:\n{ "last_transaction_time": ' + result.data.time + ' }')

   }
   else dbg.logDeep('\nresult:\n', result)
 })
