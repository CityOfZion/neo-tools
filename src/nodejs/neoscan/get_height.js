// neoscan get_height

const neoscan = require('./neoscan.js')
const dbg   = require('../debug')
const program = require('commander');
var cfg     = require('./config.json')

var apiv1 = cfg.api.v1;

// dbg.logDeep('apiv1', apiv1)

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
 neoscan.get_height().then(result => {
   print(result)
 })

// get port name from the command line:
// portName  = process.argv[2];
// code      = process.argv[3];
// duration  = process.argv[4] * 1000;
