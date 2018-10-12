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

// Allow shortcuts for main net and test net (.i.e., main, Main and Main_Net resolve to MainNet),
// but pass custom network names right through

exports.resolveNetworkId = (networkId) => {
  let net = networkId.toLowerCase()

  if (net === 'mainnet' || net === 'main' || net === 'main_net') net = 'MainNet'
  else if (net === 'testnet' || net === 'test' || net === 'test_net') net = 'TestNet'
  else net = networkId

  return net
}


// Return an array of nodes sorted into a list with tallest first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByTallest = (nodes) => {
  let rankedList = []
  let i = 0
  return new Promise((resolve, reject) => {

    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.getBlockCount().then(response => {
            rankedList.push({ "url": n.url, "height": response })

            if (i++ === (nodes.length - 1)) {
              rankedList = _.sortBy(rankedList, 'height')
              rankedList = rankedList.reverse()
              resolve(rankedList)
            }
          })
        }
      })
    }
  })
}

// Return an array of nodes sortyed with least connections first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByLeastConnections = (nodes) => {
  let rankedList = []
  let i = 0

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.getConnectionCount().then(response => {
            rankedList.push({ "url": n.url, "connections": response })
            if (i++ === (nodes.length - 1)) {
              rankedList = _.sortBy(rankedList, 'connections')
              resolve(rankedList)
            }
          })
        }
      })
    }
  })
}
