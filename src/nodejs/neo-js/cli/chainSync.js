// chainSync.js
// CLI module interface to neo-js block synchronizer
// https://github.com/cityofzion/neo-js
// This calls nodejs/neo-js/modules/chainSync.js

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netUtil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const command = require('nodejs_neo-js/modules/chainSync')


let nodes = []
let defly = false
let arg

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-H, --Human', 'I am human so make outputs easy for human')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-s, --storage [storage]', 'Select storage type: i.e., mongodb (default)', 'mongodb')
  .option('-c, --connection [connection]', 'Specify the connection string for the storage type', 'mongodb://localhost/neo_testnet')
  .on('--help', () => {
    print('Note: see https://github.com/cityofzion/neo-js for more information about the module this uses.')
    print('This will start a process to pull nodes from the selected Neo network as quickly as possible.')
    print('Please use with care')
  })
  .parse(process.argv)

dbg.logDeep('n: ', cfg.getNeoJs())

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

let runtime = {
  'net': program.Net,
  'debug': defly,
  'human': program.Human ? program.Human : false,
  'storage': program.storage,
  'connection': program.connection
}

commandWrapper(runtime)

function commandWrapper(runtimeArgs) {

  if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

  command.run(runtimeArgs).then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch (error => {
    print(__filename + ': ' + error.message)
  })
}
