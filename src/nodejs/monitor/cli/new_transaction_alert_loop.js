// new_transactions_alert_loop.js
// This module runs forever looking for new transactions.
// If it finds one, it sends an email.


require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')
const email   = require('nodejs_alert/email')

const get_last_transactions_by_address = require('nodejs_neoscan/modules/get_last_transactions_by_address')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')



let isCLI = true
let argus
let defly = false
let address

function print(msg) {
  console.log(msg)
}


program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address [address]', 'Specify the address for transaction inquiry')
  .option('-t, --time', 'Only return time field of last transactions')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-p, --period [period]', 'Period in seconds between successive transaction inquries', 300)
  .option('-l, --loop [loop]', 'Loop this many times, default is infinite', 0)
  .option('-i, --index [index]', 'Get transaction at this index, 0 is the most recent transaction', 0)
  .option('-e, --email [email]', 'Send email to this address each time a new transaction is found')
  // TODO reverse sort order
  // summarize transaction - show amount of last n txs or similar
  .parse(process.argv)

if (program.debug) {
    print('DEBUGGING')
    defly = true
    email.debug(true)
}

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

var result

let argz = []
// argz.concat(process.argv)
// argz.concat(['-a', address, '-n', program.net, '-t', '-i', 0, '-H', program.debug])
if (defly) dbg.logDeep('argv: ', process.argv)
if (defly) dbg.logDeep('argz: ', argz)

let i = 1

if (defly) print('sleeping: ' + program.period + ' s')

const intervalObj = setInterval(() => {
  if (defly) print('loop #: ' + i + ' of ' + (program.loop ? program.loop : 'infinity'))

  if (i > program.loop && program.loop !== 0) {
    clearInterval(intervalObj)
    if (defly) print('clearing timer')
  }

  if (defly) print('sleeping: ' + program.period + ' s')

  get_last_transactions_by_address.run().then((r) => {
    dbg.logDeep('\nresult:\n', r)
  })
}, program.period * 1000)
