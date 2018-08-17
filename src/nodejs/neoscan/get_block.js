// neoscan get_block

const neoscan = require('./neoscan.js')
const dbg   = require('../debug')
const program = require('commander');
var cfg     = require('./config.json')

var apiv1 = cfg.api.v1;

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
  // print('network: ' + program.net);
}

if (!program.hash) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

neoscan.set_net(program.net)
 neoscan.get_block(program.hash).then(result => {
   print(result)
 })
