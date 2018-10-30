// rpc validateAddress in neon-js
// Verify that the address is a correct NEO address
// boolean return

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-d, --debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use (be sure to preface with https://)')
  .option('-a, --address <address>', 'address to validate')

  .parse(process.argv);

if (!program.node || !program.address) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

const client = neon.default.create.rpcClient(program.node)

client.validateAddress(program.address).then(response => {
  dbg.logDeep('result:\n', response)
})
