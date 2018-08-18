// neoscan get_all_nodes

require('module-alias/register')

const program = require('commander');

const neoscan = require('nodejs_neoscan/neoscan')
const dbg     = require('nodejs_util/debug')

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (program.debug) {
  print('DEBUGGING');
}

neoscan.set_net(program.net)
 neoscan.get_all_nodes().then(result => {
   print(result)
 })