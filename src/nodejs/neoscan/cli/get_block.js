  // neoscan get_block

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')


function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('<hash>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-h, --hash <block hash>', 'Specify the block by hash for block inquiry')
  .parse(process.argv);

if (!program.net) {
}

if (!program.hash) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

neoscan.set_net(program.net)

neoscan.get_block(program.hash).then(result => {
  print('\nresult:\n' + result)
})
