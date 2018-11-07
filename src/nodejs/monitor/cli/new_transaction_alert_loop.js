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
  .option('-y, --youngerThan [youngerThan]', 'Set the age in minutes that a transaction must be younger than to alert. By default, any new transactions alert, but loop must be at least 2', 6)
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

var result

let argz = {
  'debug': defly,
  'net': program.Net,
  'address': address,
  'page': 0,
  'time': program.time ? program.time : false,
  'human': program.Human ? program.Human : false,
  'index': 0
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
  print('Searching news for ' + address)

  neoscan.get_address_abstracts(address, 0).then((r) => {
    let message = {
      to: to,
      subject: subject,
      body: program.body
    }

    let entry = r.data.entries[0]
    let toAddress = entry.address_to
    let from = entry.address_from
    let amount = entry.amount
    let blockheight = entry.block_height
    let time = new Date(entry.time * 1000).toLocaleString()
    let txid = entry.txid

    let rstr = message.body = amount + ' ' + time + ' ' + from + ' ' + toAddress

    if (program.youngerThan === 6) {
      lastTransactionTest = last_run_result && (last_run_result !== rstr)
    }
    else {
      print('Looking for transactions younger than: ' + program.youngerThan + ' minutes')

      let time = r.data.entries[0].time

      if (time) {
        let now = new Date().getTime()
        let lastLocaleTxTime = new Date(time * 1000).toLocaleString()

        let txTime = new Date(time * 1000).getTime()
        timeA = new Date(Math.abs(now - txTime)).getTime()

        let minutesSince = (timeA/1000)/60
        let hoursSince = minutesSince / 60
        let daysSince = hoursSince / 24

        print('last tx: ' + lastLocaleTxTime + ' ~' + Math.round(daysSince) + ' days = ~' +  Math.round(hoursSince) + ' hours = ~' + Math.round(minutesSince) + ' minutes')

        lastTransactionTest = minutesSince < program.youngerThan
      } else {
        print('no time field found - assuming no news')
        lastTransactionTest = false
      }
    }
    if (lastTransactionTest) {
      print('New Transaction')
      email.send(message).then((id) => {
        print('Message away: ' + id)
        alerts++
      })
    } else {
    }
    last_run_result = rstr

    if (defly) print('last result: ' + last_run_result)

    print(alerts + ' alert(s). sleeping: ' + program.wait + ' s ')
  })
}
