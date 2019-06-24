// network vitals module
// this queries nodes on the specified network and generates a report
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
  .option('-D, --Debug', 'Debug')
  .option('-s, --summary', 'summarizes details like getrawmempool and getpeers to integers instead of lists')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .parse(process.argv);

if (program.Debug) {
  print('DEBUGGING');
  neoscan.debug(true)
}

print(program.net)

neoscan.set_net(program.net)

neoscan.get_all_nodes().then(result => {
  dbg.logDeep('nodes: ', result)
  print('\n\n')
  result.map(node => {
    get_node_health(node.url)
    print('\n\n')
  })
})

function get_node_health(node) {
  const client = neon.default.create.rpcClient(node)

  client.getVersion().then(response => {
    print('node: ' + node)
    dbg.logDeep('getVersion: ', response)
    print('\n\n')
  }).catch(e =>{
    print('node: ' + node)
    print('error: ' + e)
  })

  client.getPeers().then(response => {
    print('node: q' + node)
    if (program.summary) {
      print('getPeers connected ' + response.connected.length)
      print('getPeers unconnected ' + response.unconnected.length)
      print('getPeers bad ' + response.bad.length)
    } else dbg.logDeep('getPeers ', response)
    print('\n\n')
  })

  client.getConnectionCount().then(response => {
    print('node: ' + node)
    dbg.logDeep('getConnectionCount: ', response)
    print('\n\n')
  })

  client.getBlockCount().then(response => {
    print('node: ' + node)
    dbg.logDeep('getBlockCount ', response)
    print('\n\n')
  })

  client.getRawMemPool().then(response => {
    print('node: ' + node)
    if (program.summary) {
      print('getRawMemPool ' + response.length)
    } else dbg.logDeep('getRawMemPool\nresult\n', response)
    print('\n\n')
  })
}
