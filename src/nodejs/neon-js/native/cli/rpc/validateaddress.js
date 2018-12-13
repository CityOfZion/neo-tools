// RPC validateAddress in neon-js
// Verify that the address is a correct NEO address
// boolean return

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-D, --Debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use (be sure to preface with https://)')
  .option('-a, --address <address>', 'address to validate')

  .parse(process.argv);

if (!program.node || !program.address) {
  program.help()
}

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

const client = neon.default.create.rpcClient(program.node)

client.validateAddress(program.address).then(response => {
  dbg.logDeep(' ', response)
})
