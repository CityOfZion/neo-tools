// get_last_block_time.js

// neoscan module to get the most recent block time from neoscan in millisceonds since Jan 1, 1970

require('module-alias/register')

const request = require('async-request');

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')


function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('Show last block creation time in milliseconds since Jan 1, 1970')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-H, --Human', 'I am human so make outputs easy for human. If you do this with the delta option it will not make sense.')
  .option('-h, --height', 'Include height field in output.')
  .option('-D, --Delta', 'Show last block delta from present time instead of the time it was created.')
  .option('-s, --seconds', 'Convert time to seconds. These are mutually exclusive, supplying both -s and -m does not give both values.')
  .option('-m, --minutes', 'Convert time to minutes. These are mutually exclusive, supplying both -s and -m does not give both values.')
  .parse(process.argv);

if (program.debug) {
  print('DEBUGGING');
  neoscan.debug(true)
}

neoscan.set_net(program.net)

neoscan.get_height().then(result => {

  if (program.height) dbg.logDeep('\nheight:\n', result)

  if (result && result.height) {
    neoscan.get_block(result.height).then(result => {
      if (result && result.time) {
        let keyStr

        if (program.Delta) {
          keyStr = '"time_since_last_block"'
          let now = new Date().getTime()
          let blc = new Date(result.time * 1000).getTime()
          result.time = new Date(Math.abs(now - blc)).getTime()

          if (program.seconds) result.time = result.time / 1000

          else if (program.minutes) result.time = new Date(result.time).getMinutes()

          if (program.debug) {
            print('now: ' + now)
            print('res: ' + blc)
            print('new: ' + result.time )
          }
        }
        else {
          keyStr = '"last_block_time"'
        }

        if (program.Human) {
          result.time = new Date(result.time * 1000).toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' })
        }

        print(' { ' + keyStr + ': "' + result.time + '" }')
      }
      else print('error')
    })
  }
})
