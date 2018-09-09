// rpc getpeers in neon-js
// Gets a list of nodes that are currently connected/disconnected/bad by this node
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

client.getPeers().then(response => {
  if (program.summary) {
    print('getPeers connected\nresult:\n' + response.connected.length)
    print('getPeers unconnected\nresult:\n' + response.unconnected.length)
    print('getPeers bad\nresult:\n' + response.bad.length)
  } else dbg.logDeep('getPeers\nresult:\n', response)
})
