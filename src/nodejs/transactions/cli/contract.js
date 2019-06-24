// transactions/cli/contract.js cli module
//
// This calls transactions/modules/contract.js
// This uses neon-js to create a contract transaction hex id 0x80 System Fee 0
//
// See http://docs.neo.org/en-us/network/network-protocol.html for details

// TODO Add account name description. For now it is left up to the user to know which account to supply the password for when prompted.
// TODO Add secure password parameter option or config file password option.

require('module-alias/register')

const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var cfg       = require('nodejs_config/config')
var account   = require('nodejs_account/account')
const netUtil = require('nodejs_util/network')

const command = require('nodejs_transactions/modules/contract')

var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg);
}

let configData
let nodes = []
let defly = false

program
  .version('0.1.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')
  .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-a, --account [account]', 'Use account with name account', '')
  .option('-e, --encryptedKey [ewencryptedKeyf]', 'Rather than get the text to decrypt from config, supply it with this option', '')
  .on('--help', function(){
    print('If no account name is supplied the account marked default: true in the configuration file is used.')
  })
  .parse(process.argv);

if (program.config) {
  path = program.config
  configData = cfg.load(path)
} else configData = config

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
}

if (!program.node) {
  // get a node from the list and try it
  let net = netUtil.resolveNetworkId(program.Net)

  nodes = cfg.getNodes(net)

  let options = {
    net: net,
    order: 'asc',
    nodes: nodes
  }

  if (defly) dbg.logDeep('config nodes: ', nodes)

  getNodesBy.tallest(options).then(rankedNodes => {
    if (defly) dbg.logDeep(__filename + ': getNodesByPing().rankedNodes: ', rankedNodes)
    nodes = rankedNodes
    commandWrapper(nodes)
  })
  .catch (error => {
    print(__filename + ': ' + error.message)
  })
}
else {
  nodes.push({ "url": program.node })
  commandWrapper(nodes)
}


let options = {
  'Debug': defly,
  'name': program.account ? program.account : '',
  'encryptedKey': program.encryptedKey ? program.encryptedKey : ''
}

if (defly) dbg.logDeep('options: ', options)

command.run(options)
  .then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch(e => {
    print('error: ' + e)
  })
