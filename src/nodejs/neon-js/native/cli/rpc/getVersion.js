// rpc getVersion in neon-js
// Gets version information of this node

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

// var neon      = require('neon-js')
var neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

let defly = false

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
  print('DEBUGGING: ' + __filename)
  defly = true
}

const client = neon.default.create.rpcClient(program.node)

client.getVersion().then(response => {
  dbg.logDeep(' ', response)
})
