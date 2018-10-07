// rpc getBlockCount in neon-js
// This Query returns the current block height.

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
  .option('-h, --hash [hash]', 'specify the hash of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-i, --index [index]', 'specify the number of the block to fetch, if no hash or index is supplied will get the tallest')
  .option('-t, --time', 'Only return time field of last block')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .parse(process.argv);

if (program.debug) {
  print('DEBUGGING');
}

if (!program.node) {
  program.help()
}

if (program.hash) arg = program.hash
if (program.index) arg = program.index

const client = neon.default.create.rpcClient(program.node)

if (!program.hash && !program.index) { // get the tallest by default
  client.getBestBlockHash().then(response => {
    dbg.logDeep('', response)

    getBlock(response)
  })
} else {
  getBlock(arg)
}

function getBlock(arg) {
  client.getBlock(arg).then(response => {
    if (program.Human) {
        response.time = new Date(response.time * 1000).toLocaleString()
    }
    if (program.time) {
      print('result:\n' + response.time)
    }
    else dbg.logDeep('result:\n', response)
  })
}
