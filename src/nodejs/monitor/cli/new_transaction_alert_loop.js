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


let defly = false
let address
let from
let to

function print(msg) {
  console.log(msg)
}


program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test')
  .option('-a, --address [address]', 'Specify the address for transaction inquiry')
  .option('-t, --time', 'Only return time field of last transactions')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-w, --wait [wait]', 'Period in seconds to wait between successive transaction inquries', 300)
  .option('-p, --page [page]', 'Show last stransactions for [address] starting at [page]', 1)
  .option('-l, --loop [loop]', 'Loop this many times, default is infinite', 0)
  .option('-i, --index [index]', 'Get transaction at this index, 0 is the most recent transaction', 0)
  .option('-T, --ToEmail [ToEmail]', 'Send email to this address each time a new transaction is found')
  .option('-F, --FromEmail [FromEmail]', 'Send email from this address each time a new transaction is found, will use defaults in config if not present')
  .option('-S, --Subject [Subject]', 'Set the subject', 'New Transaction')
  // TODO reverse sort order
  // summarize transaction - show amount of last n txs or similar
  .parse(process.argv)

if (program.debug) {
    print('DEBUGGING: ' + __filename)
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

if (program.FromEmail) {
  from = program.FromEmail
} else {
  from = cfg.get_smtp().from
}

if (defly) dbg.logDeep('from: ', from)

if (program.ToEmail) {
  to = program.ToEmail
} else {
  to = cfg.get_smtp().to
}

if (defly) dbg.logDeep('to: ', to)

var result

let argz = {
  'debug': defly,
  'net': program.net,
  'address': address,
  'page': program.page,
  'time': program.time ? program.time : false,
  'human': program.Human ? program.Human : false,
  'index': program.index
}

let i = 1

if (defly) print('sleeping: ' + program.wait + ' s')

let last_run_result = ''

const intervalObj = setInterval(() => {
  if (i > program.loop && program.loop !== 0) {
    clearInterval(intervalObj)
    print('clearing timer')
  } else {
    print('loop #: ' + i + ' of ' + (program.loop ? program.loop : 'infinity'))

    get_last_transactions_by_address.run(argz).then((r) => {
      let message = {
        to: to,
        subject: program.Subject + ' for ' + address,
        body: program.body
      }

      let rstr = message.body = dbg.lookDeep('\nresult:\n', r)

      if (defly) dbg.logDeep('body: ', message.body)

      if (last_run_result && last_run_result !== rstr) {
        print('New Transaction')
        email.send(message).then((id) => {
          print('message away: ' + id)
        })
      }
      last_run_result = rstr
    })
  }

  print('sleeping: ' + program.wait + ' s')
  i++
}, program.wait * 1000)
