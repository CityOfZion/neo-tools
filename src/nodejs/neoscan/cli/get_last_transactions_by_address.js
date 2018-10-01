// neoscan get_last_transactions_by_address

require('module-alias/register')

let isCLI = true
let argus

exports.run = (arglist) => {
  return new Promise((resolve, reject) => {
    if (arglist === null || arglist === undefined) isCLI = true
    else isCLI = false

    const program = require('commander');
    const _       = require('underscore')

    const dbg     = require('nodejs_util/debug')
    const neoscan = require('nodejs_neoscan/neoscan')
    var cfg       = require('nodejs_config/config.js')
    var config    = cfg.load('nodejs_config/nodejs.config.json')

    if (isCLI) {
      argus = process.argv
    } else argus = arglist

    let pageArg = ''
    let address
    let results = []

    function print(msg) {
      console.log(msg)
    }


    program
      .version('0.1.0')
      .usage('[address] [page]')
      .option('-d, --debug', 'Debug')
      .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
      .option('-a, --address [address]', 'Specify the address for transaction inquiry')
      .option('-p, --page [page]', 'Show last stransactions for <address> starting at [page]', 1)
      .option('-t, --time', 'Only return time field of last transactions')
      .option('-H, --Human', 'I am human so make outputs easy for human')
      .option('-i, --index [index]', 'Get transaction at this index, 0 is the most recent transaction', 0)
      // TODO reverse sort order
      // summarize transaction - show amount of last n txs or similar
      .parse(argus)

    if (program.debug) {
      print('DEBUGGING')
      neoscan.debug(true)
      dbg.logDeep('argv: ', process.argv)
    }

    if (!program.net) {
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

    neoscan.configure({ transaction_limit: program.index, human_dates: program.Human })

    neoscan.set_net(program.net)

    neoscan.get_last_transactions_by_address(address, pageArg).then(txs => {
     if (txs && txs.data && txs.data) {
       if (_.isArray(txs.data)) {
         txs.data.forEach((tx) => {
           if (program.time) {
             if (program.Human) {
               results.push({ "last_transaction_time": new Date(tx.time * 1000).toLocaleString() })
             }
             else {
               results.push({ "last_transaction_time": tx.time })
             }
           } else if (program.Human) {
             tx.time = new Date(tx.time * 1000).toLocaleString()
           }
         })
         if (!program.time) dbg.logDeep('\nresult:\n', txs)
         else dbg.logDeep('\nresult:\n', results)
       } else if (txs.data.time) { // not array
         if (program.Human) {
           results.push({ "last_transaction_time": new Date(txs.data.time * 1000).toLocaleString() })
           dbg.logDeep('\nresult:\n', results)
         }
         else {
           results.push({ "last_transaction_time": tx.data.time })
           dbg.logDeep('\nresult:\n', results)
         }
       } else {
         print('error: no time field in response data.')
       }
       resolve(results)
     }
    })
  })
}

// if (isCLI) this.run()
