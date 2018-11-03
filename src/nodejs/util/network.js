// network.js

// network helper functions

// TODO: rewrite getNodesByWhatever to first call getNodesByPing

require('module-alias/register')

const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var neon      = require('@cityofzion/neon-js')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let node  = ''
let defly = false
let maxPing = 2000


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
  else print('This is your last debugging message! neoscan api debugging disabled')
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


// Select RPC nodes on options.net by options.byFunc
// byFunc is one of any of the getNodesBy functions in this module, i.e., getNoddesByPing
// Returns a promise of an array that is empty or full of sorted nodes.
// This will ALWAYS ping.

exports.getRpcNodes = (options) => {
  options.net ? options.net : options.net = 'TestNet'
  options.byFunc ? options.byFunc : options.byFunc = 'getNodesByPing'

  let byFunc = options.byFunc

  let net = this.resolveNetworkId(options.net)

  let nodes = cfg.getNodes(net)

  if (defly) {
    dbg.logDeep(__filename + ': getRpcNode().options: ', options)
    dbg.logDeep(__filename + ': getRpcNode().net: ', net)
    dbg.logDeep(__filename + ': getRpcNode().cfg.GetNodes(): ', nodes)
    dbg.logDeep(__filename + ': getRpcNode().byFunc: ', byFunc)
  }

  return new Promise((resolve, reject) => {
    this[byFunc](nodes).then(rankedNodes => {
      if (defly) dbg.logDeep(__filename + ': getRpcNode().rankedNodes: ', rankedNodes)
      resolve(rankedNodes)
    })
    .catch (error => {
      reject(__filename + ': ' + byFunc + ': ' + error.message)
    })
  })
}



// Return an array of nodes sorted into a list with tallest first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByTallest = (nodes) => {
  let rankedList = []
  let i = 0, errors = 0, highPings = 0
  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          if (defly) print('getting node height for: ' + n.url)

          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            if (ms < maxPing) {
              client.getBlockCount().then(response => {
                if (response) rankedList.push({ "url": n.url, "height": response })

                if ((i++ === (nodes.length - 1)) || (i === (nodes.length - highPings))) {
                  rankedList = _.sortBy(rankedList, 'height')
                  rankedList = rankedList.reverse()
                  resolve(rankedList)
                }
              }).catch(error => {
                print('error: ' + error)
                errors++
              })
            } else {
              highPings++
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
  let i = 0, errors = 0, highPings = 0

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            if (ms < maxPing) {
              client.getConnectionCount().then(response => {
                if (response) rankedList.push({ "url": n.url, "connections": response })
                if ((i++ === (nodes.length - 1)) || (i === (nodes.length - highPings))) {
                  rankedList = _.sortBy(rankedList, 'connections')
                  resolve(rankedList)
                }
              }).catch(error => {
                print('error: ' + error)
                errors++
              })
            } else {
              highPings++
            }
          })
        }
      })
    }
  })
}

// Return an array of nodes sortyed with highest version first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByVersion = (nodes) => {
  let rankedList = []
  let i = 0, errors = 0, highPings = 0

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            i++

            if (ms < maxPing) {
              client.getVersion().then(response => {
                if (response) rankedList.push({ "url": n.url, "version": response })

                if (i === nodes.length) {
                  rankedList = _.sortBy(rankedList, 'version')
                  resolve(rankedList)
                }
              })
              .catch(error => {
                print(__filename + ': getNodesByVersion().error: ' + error)
              })
            }
          })
          .catch(error => {
            i++

            print(__filename + ': getNodesByVersion().error: ' + error)

            if (i === nodes.length) {
              rankedList = _.sortBy(rankedList, 'version')
              resolve(rankedList)
            }
          })
        }
      })
    }
  })
}


// Return an array of nodes sortyed with lowest pings first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByPing = (nodes) => {
  let rankedList = []
  let i = 0

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            i++

            if (ms < maxPing) {
              rankedList.push({ "url": n.url, "ping": ms })
            }

            if (i === nodes.length) {
              rankedList = _.sortBy(rankedList, 'ping')
              resolve(rankedList)
            }
          })
          .catch(error => {
            i++

            print(__filename + ': getNodesByPing().error: ' + error)

            if (i === nodes.length) {
              rankedList = _.sortBy(rankedList, 'ping')
              resolve(rankedList)
            }
          })
        }
      })
    }
  })
}
