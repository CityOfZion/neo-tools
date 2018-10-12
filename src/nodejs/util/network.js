// network.js

// network helper functions

require('module-alias/register')


const dbg     = require('nodejs_util/debug')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let node  = ''
let defly = false

function print(msg) {
  console.log(msg);
}

// Allow shortcuts for main net and test net (.i.e., main, Main and Main_Net resolve to MainNet),
// but pass custom network names right through

exports.resolveNetworkId = (networkId) => {
  let net = networkId.toLowerCase()

  if (net === 'mainnet' || net === 'main' || net === 'main_net') net = 'MainNet'
  else if (net === 'testnet' || net === 'test' || net === 'test_net') net = 'TestNet'
  else net = networkId

  return net
}
