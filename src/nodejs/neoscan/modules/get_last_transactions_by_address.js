// neoscan get_last_transactions_by_address module
// is called by cli/get_last_transactions_by_address
// TODO reverse sort order
// TODO summarize transaction - show amount of last n txs or similar

require('module-alias/register')

const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')
var cfg       = require('nodejs_config/config.js')

// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.net      // Set Neo network, usually TestNet or MainNet
// program.address  // Set address or array of addresses to query
// program.page     // Get this page of a multipage transaction result
// program.time     // Pluck time field only from transasction data
// program.human    // Make dates human-readable
// program.index    // Only get transaction at this index

exports.run = (config) => {
  let program = {}

  if (config) program = config
  else {
    program.debug = false
    program.net = 'TestNet'
    program.address = null
    program.page = 1
    program.time = false
    program.human = false
    program.index = 0
  }

  if (program.debug) dbg.logDeep('config: ', config)

  return new Promise((resolve, reject) => {
    var config    = cfg.load('nodejs_config/nodejs.config.json')

    let pageArg = ''
    let address
    let results = []
    let defly = false

    function print(msg) {
      console.log(msg)
    }

    if (program.debug) {
      print('DEBUGGING: ' + __filename)
      defly = true
      neoscan.debug(true)
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

    neoscan.configure({ transaction_limit: program.index, human_dates: program.human })

    neoscan.set_net(program.net)

    neoscan.get_last_transactions_by_address(address, pageArg).then(txs => {
     if (txs && txs.data && txs.data) {

       if (_.isArray(txs.data)) {
         txs.data.forEach((tx) => {
           if (program.time) {
             if (program.human) {
               results.push({ "last_transaction_time": new Date(tx.time * 1000).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' }) })
             }
             else {
               results.push({ "last_transaction_time": tx.time })
             }
           } else if (program.human) {
             tx.time = new Date(tx.time * 1000).toLocaleString()
           }
         })

         if (!program.time) {
           if (defly) dbg.logDeep(' ', txs)
           results = txs
         }
         else {
           if (defly) dbg.logDeep(' ', results)
         }
       } else if (txs.data.time) { // not array
         if (program.human) {
           if (program.time) results.push({ "last_transaction_time": new Date(txs.data.time * 1000).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' }) })
           else {
             txs.data.time = new Date(txs.data.time * 1000).toLocaleString()
             results.push(txs.data)
           }
           if (defly) dbg.logDeep(' ', results)
         }
         else if (program.time) {
           results.push({ "last_transaction_time": txs.data.time })

           if (defly) dbg.logDeep(' ', results)
         } else {
           results.push(txs.data)

         }
       } else {
         reject('error: no time field in response data.')
       }

       if (defly) dbg.logDeep('results: ', results)

       resolve(results)
     }
    })
  })
}
