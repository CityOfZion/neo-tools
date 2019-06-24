// network.js

// network helper functions

require('module-alias/register')

const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var neon      = require('@cityofzion/neon-js')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let node  = ''
let defly = false

function print(msg) {
  console.log(msg);
}


exports.configure = (cfgObj) => {
  ({ maxPing } = cfgObj)
}


exports.debug = (debug) => {
  if (debug !== undefined) defly = debug
  else defly = !defly
  if (defly) print(__filename + ': API debugging enabled')
  else print('This is your last debugging message! API debugging disabled')
}


// Allow shortcuts for main net and test net (.i.e., main, Main and Main_Net resolve to MainNet),
// but pass custom network names right through

exports.resolveNetworkId = (networkId) => {
  let net = networkId.toLowerCase()

  if (net == 'MainNet' || net === 'TestNet') return net

  if (net === 'mainnet' || net === 'main' || net === 'main_net') net = 'MainNet'
  else if (net === 'testnet' || net === 'test' || net === 'test_net') net = 'TestNet'
  else net = networkId

  return net
}
