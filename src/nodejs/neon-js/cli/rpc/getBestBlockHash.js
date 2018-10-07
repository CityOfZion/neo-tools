// rpc getBestBlockHash in neon-js
// Get the latest block hash.
// hash of the block

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-d, --debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use (be sure to preface with https://)')

  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

const client = neon.default.create.rpcClient(program.node)

client.getBestBlockHash().then(response => {
  dbg.logDeep('result:\n', response)
})
