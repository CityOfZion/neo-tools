// new_transactions_alert_loop.js
// This module runs forever looking for new transactions.
// If it finds one, it sends an email.

// NOTE: First item in tx array is the most recent

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')
const email   = require('nodejs_alert/email')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let defly = false
let lastTransactionTest = false
let address
let from
let to
let subject

function print(msg) {
  console.log(msg)
}

program
  .version('0.3.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-N, --Net [Net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test')
  .option('-a, --address [address]', 'Specify the address for transaction inquiry')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-w, --wait [wait]', 'Period in seconds to wait between successive transaction inquries', 300)
  .option('-l, --loop [loop]', 'Loop this many times, default is infinite', 0)
  .option('-T, --ToEmail [ToEmail]', 'Send email to this address each time a new transaction is found')
  .option('-F, --FromEmail [FromEmail]', 'Send email from this address each time a new transaction is found, will use defaults in config if not present')
  .option('-S, --Subject [Subject]', 'Set the subject; if this is not supplied, "New Transaction for <address>" is used by default')
  .option('-y, --youngerThan [youngerThan]', 'Set the age in minutes that a transaction must be younger than to alert. By default, any new transactions alert, but loop must be at least 2')
  // TODO reverse sort order
  // summarize transaction - show amount of last n txs or similar
  .parse(process.argv)

if (program.debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
    email.debug(true)
    neoscan.debug()
}
if (!program.address) {
  // check for a default address in config, if not pressent show help
  var default_account = cfg.getDefaultAccount()

  if(default_account) address = default_account.address

  else program.help()
} else {
  address = program.address
}
if (program.FromEmail) {
  from = program.FromEmail
} else {
  from = cfg.getSmtp().from
}
if (defly) dbg.logDeep('from: ', from)

if (program.ToEmail) {
  to = program.ToEmail
} else {
  to = cfg.getSmtp().to
}
if (program.Subject) subject = program.Subject
else subject = 'New Tranaction ' + ' for ' + address

if (defly) dbg.logDeep('to: ', to)

let result
let argz = {
  'debug': defly,
  'net': program.Net,
  'address': address,
  'time': program.time ? program.time : false,
  'human': program.Human ? program.Human : false
}
let i = 1, alerts = 0

if (defly) print('sleeping: ' + program.wait + ' s')

let last_run_result = ''

neoscan.set_net(program.Net)

get_last_transaction(argz)

const intervalObj = setInterval(() => {
  if (i >= program.loop && program.loop !== 0) {
    clearInterval(intervalObj)
    print('times up ------')
  } else {
    print('loop #: ' + i + ' of ' + (program.loop ? program.loop : 'infinity'))
    get_last_transaction(argz)
  }
  i++
}, program.wait * 1000)

function get_last_transaction(runtimeArgs) {
  if (program.youngerThan) {
    if (program.youngerThan === true) program.youngerThan = 1
    print('Searching ' + address + ' for transactions younger than ' + program.youngerThan + ' minutes')
  }
  else {
    print('Searching ' + address + ' for new transactions')
  }
  neoscan.get_address_abstracts(address, 0).then((r) => {
    let message = {
      to: to,
      subject: subject,
      body: program.body
    }
    if (r && r.data && r.data.entries.length) {
      let entry = r.data.entries[0]
      let toAddress = entry.address_to
      let from = entry.address_from
      let amount = entry.amount
      let blockheight = entry.block_height
      let lastTxTimeInS = new Date(entry.time * 1000).getTime()
      let lastTxTimeAsLocale = new Date(lastTxTimeInS).toLocaleString()
      let txid = entry.txid
      let rstr = message.body = amount + ' ' + lastTxTimeAsLocale + ' ' + from + ' ' + toAddress
      let now = new Date().getTime()
      timeA = new Date(Math.abs(now - lastTxTimeInS)).getTime()
      let minutesSince = timeA / 1000 / 60
      let hoursSince = minutesSince / 60
      let daysSince = hoursSince / 24

      if (lastTxTimeInS) {
        print('last tx @ ' + lastTxTimeAsLocale + ' or ~' + Math.round(daysSince) + ' days or ~' +  Math.round(hoursSince) + ' hours or ~' + Math.round(minutesSince) + ' minutes ago')

        if (program.youngerThan) lastTransactionTest = minutesSince < program.youngerThan
        else lastTransactionTest = last_run_result && (last_run_result !== rstr)
      } else {
        print('No transaction time field found so there can\'t be any news.')
        lastTransactionTest = false
      }
      if (lastTransactionTest) {
        print('New Transaction')
        email.send(message).then((id) => {
          print('Message away: ' + id)
          alerts++
          print(alerts + ' alert(s). sleeping: ' + program.wait + ' s ')
        })
      } else {
        print(alerts + ' alert(s). sleeping: ' + program.wait + ' s ')
      }
      last_run_result = rstr

      if (defly) print('last result: ' + last_run_result)
    } else {
      print('No transactions to search.')
    }
  })
}
