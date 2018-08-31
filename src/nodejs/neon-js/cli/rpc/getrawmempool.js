// rpc getrawmempool in neon-js
// Gets a list of unconfirmed transactions in memory
//
require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')

const neoscan = require('nodejs_neoscan/neoscan')
const dbg     = require('nodejs_util/debug')

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-d, --debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use (be sure to preface with https://)')
  .option('-s, --summary', 'summarizes details to integer count of items in the list usually returned')

  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

const client = neon.default.create.rpcClient(program.node)

client.getRawMemPool().then(response => {
  if (program.summary) {
    print('getRawMemPool\nresult:\n' + response.length)
  } else dbg.logDeep('getRawMemPool\nresult:\n', response)
})
