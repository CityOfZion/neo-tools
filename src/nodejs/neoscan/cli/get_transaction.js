// neoscan get_transaction

require('module-alias/register')

const program = require('commander');

const dbg     = require('nodejs_util/debug')
const neoscan = require('nodejs_neoscan/neoscan')


let argus = process.argv

function print(msg) {
  console.log(msg)
}

program
  .version('0.1.0')
  .usage('<hash>')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-h, --hash <transaction hash>', 'Specify the tranaction by hash for transaction inquiry')
  .parse(argus)

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.hash) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING')
  neoscan.debug(true)
}

neoscan.set_net(program.net)

neoscan.get_transaction(program.hash).then(result => {
  dbg.logDeep('\nresult:\n', result)
})
