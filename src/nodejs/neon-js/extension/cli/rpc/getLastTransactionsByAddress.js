// neon-js/extension/cli/rpc/getLastTransactionsByAddress
// This is the CLI control file that leverages the module file:
// neon-js/extension/modules/rpc/getLastTransactionsByAddress

// RPC version of get_last_transactions_by_address (eventually, template for now)

// TODO ensure the rpc node can be reported

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const neon    = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')
const netUtil = require('nodejs_util/network')


const command = require('nodejs_neon-js/extension/modules/rpc/getLastTransactionsByAddress')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let defly = false
let address

function print(msg) {
  console.log(msg)
}

program
  .version('0.1.0')
  .usage('[address] [page]')
  .option('-d, --debug', 'Debug')
  .option('-N, --Net [Net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-a, --address [address]', 'Specify the address for transaction inquiry')
  .option('-p, --page [page]', 'Show last transactions for [address] starting at [page]', 1)
  .option('-t, --time', 'Only return time field of last transactions')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-i, --index [index]', 'Get transaction at this index, 0 is the most recent transaction', 0)
  // TODO reverse sort order
  // TODO summarize transaction - show amount of last n txs or similar
  .parse(process.argv)

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

if (!program.address) {
  // check for a default address in config, if not pressent show help
  var default_account = cfg.getDefaultAccount()

  if(default_account) address = default_account.address
  else program.help()
} else {
  address = program.address
}

let argz = {
  'debug': defly,
  'net': program.net,
  'address': address,
  'page': program.page,
  'time': program.time ? program.time : false,
  'human': program.Human ? program.Human : false,
  'index': program.index
}

if (defly) dbg.logDeep('argz: ', argz)

command.run(argz).then((r) => {
  dbg.logDeep(' ', r)
})
