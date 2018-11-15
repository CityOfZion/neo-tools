// getNodesByX
// Get a list of RPC nodes based on the given criteria

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netUtil = require('nodejs_util/network')
const neoscan = require('nodejs_neoscan/neoscan')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

const getNodesBy = require('nodejs_neo-rpc/v2.9.0/client/module/getNodesBy')

let nodes = []
let defly = false
let arg, ran = 0

function print(msg) {
  console.log(msg);
}

program
  .version('0.2.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-n, --node [node]', 'Set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
  .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
  .option('-m, --method [method]', 'Get nodes by the given criteria, default is ping', 'ping')
  .option('-o, --order [order]', 'Order by \'asc\' (ascending <- default) or \'dsc\' (descending)', 'asc')
  .option('-g, --getNodes', 'Get nodes from Neoscan ../v1/get_all_nodes REST API. If not, will use config files if -n --node options aren\'t used. ')
  .option('-c, --conf', 'Disable \'press any key to continue\' confirmation prompt')

  .on('--help', function(){
    print('Note: -m --method options are: "all", "ping", "tallest", "connection", "version", "rawmempool"')
  })
  .parse(process.argv)

if (program.debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  netUtil.debug()
  neoscan.debug()
}

let options = {
  net: netUtil.resolveNetworkId(program.Net),
  order: program.order
}

// provided node argument on command line
if (program.node) options.nodes = [{ 'url': program.node }]

else if (program.getNodes) { // get the nodes from neoscan
  neoscan.set_net(program.Net)
   neoscan.get_all_nodes().then(result => {
     if (result) options.nodes = result
     if (defly) dbg.logDeep('options.nodes: ', options.nodes)
   })
}
else { // get nodes from configuration file
  let net    = netUtil.resolveNetworkId(program.Net)
  let cfgNodes  = cfg.getNodes(net)

  options.nodes = cfgNodes
}

if (defly) dbg.logDeep('options: ', options)


function command() {
  if (ran) return
  else ran = true

  print('Using network: ' + options.net)
  print('Using method: ' + program.method)
  print('Node Count: ' + options.nodes.length)
  dbg.logDeep(' ', options.nodes)

  getNodesBy[program.method.toLowerCase()](options).then(rankedNodes => {
    if (defly) dbg.logDeep(__filename + ': getNodesByPing().rankedNodes: ', rankedNodes)
    nodes = rankedNodes
    print(rankedNodes.length + ' of ' + options.nodes.length + ' nodes responded\n')
    dbg.logDeep(' ', JSON.stringify(nodes))
    process.exit()
  })
  .catch (error => {
    print(__filename + ': ' + error)
    process.exit()
  })
}

if (program.conf) {
  command()
} else {
  print('\nWarning: this can produce a lot of traffic to the Neo network. It first pings each node in the list to make sure they are up and within operating parameters and then calls the requested RPC method.')
  print('\nThis can be disabled with -c or --conf.')
  print('Press enter to continue or CTRL-C to cancel...')

  process.stdin.on('data', () => {
    command()
  })
}
