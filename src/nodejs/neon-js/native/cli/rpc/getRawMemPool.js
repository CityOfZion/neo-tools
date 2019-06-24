// RPC getRawMemPool in neon-js
// Gets a list of unconfirmed transactions in memory
//
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
  .option('-s, --summary', 'summarizes details to integer count of items in the list usually returned')

  .parse(process.argv);

if (!program.node) {
  program.help()
}

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

const client = neon.default.create.rpcClient(program.node)

client.getRawMemPool().then(response => {
  if (program.summary) {
    print('getRawMemPool ' + response.length)
  } else dbg.logDeep('getRawMemPool ', response)
})
