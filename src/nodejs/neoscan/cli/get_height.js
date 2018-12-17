// neoscan get_height

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')

let argus = process.argv

function print(msg) {
  console.log(msg)
}

program
  .version('0.1.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .parse(argus)

if (!program.net) {
}

if (program.Debug) {
  print('DEBUGGING')
  neoscan.debug(true)
}

neoscan.set_net(program.net)

neoscan.get_height().then(result => {
  print(' { "height": ' + result.height + ' }')
})
