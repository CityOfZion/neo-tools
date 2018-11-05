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
  let opts = options ? options : opts = {}

  opts.net ? opts.net : opts.net = 'TestNet'
  opts.byFunc ? opts.byFunc : opts.byFunc = 'getNodesByPing'

  let byFunc = opts.byFunc
  let net    = this.resolveNetworkId(opts.net)
  let nodes  = cfg.getNodes(net)

  if (defly) {
    dbg.logDeep(__filename + ': getRpcNode().byFunc: ', byFunc)
    dbg.logDeep(__filename + ': getRpcNode().options: ', opts)
    dbg.logDeep(__filename + ': getRpcNode().net: ', net)
    dbg.logDeep(__filename + ': getRpcNode().cfg.GetNodes(): ', nodes)
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


// Return an array of nodes sortyed with lowest pings first
// TODO: add caching with configurable time limit for results

exports.getNodesByPing = (options) => {
  let rankedList = [], i = 0
  let opts = options ? options : opts = {}

  opts.net ? opts.net : opts.net = 'TestNet'

  let net    = this.resolveNetworkId(opts.net)
  let cfgNodes  = cfg.getNodes(net)

  opts.nodes ? opts.nodes : opts.nodes = cfgNodes

  let nodes = opts.nodes

  if (defly) {
    dbg.logDeep(__filename + ': getNodesByPing().options: ', opts)
    dbg.logDeep(__filename + ': getNodesByPing().net: ', net)
    dbg.logDeep(__filename + ': getNodesByPing().cfg.GetNodes(): ', cfgNodes)
  }

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


// Return an array of nodes sorted into a list with tallest first
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesByPing


exports.getNodesByTallest = (options) => {
  let rankedList = [], i = 0

  return new Promise((resolve, reject) => {
    this.getNodesByPing(options).then(nodes => {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            const client = neon.default.create.rpcClient(n.url)

            client.getBlockCount().then(response => {
              i++
              if (response) rankedList.push({ "url": n.url, "height": response })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'height')
                rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': getNodesByTallest().error: ' + error)
              resolve(rankedList)
            })
          }
        })
      }
    })
    .catch (error => {
      print(__filename + ': getNodesByTallest().getNodesByPing().error: ' + error)
    })
  })
}


// Return an array of nodes sortyed with least connections first
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesByPing

exports.getNodesByConnections = (options) => {
  let rankedList = [], i = 0

  return new Promise((resolve, reject) => {
    this.getNodesByPing(options).then(nodes => {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            const client = neon.default.create.rpcClient(n.url)

            client.getConnectionCount().then(response => {
              i++
              if (response) rankedList.push({ "url": n.url, "connections": response })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'connections')
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': getNodesByConnections().error: ' + error)
              resolve(rankedList)
            })
          }
        })
      }
    })
    .catch (error => {
      print(__filename + ': getNodesByConnections().getNodesByPing().error: ' + error)
    })
  })
}


// Return an array of nodes sortyed with highest version first
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesByPing

exports.getNodesByVersion = (options) => {
  let rankedList = [], i = 0

  return new Promise((resolve, reject) => {
    this.getNodesByPing(options).then(nodes => {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            print(n.url)
            const client = neon.default.create.rpcClient(n.url)

            client.getVersion().then(response => {
              i++
              if (response) rankedList.push({ "url": n.url, "version": response })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'version')
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': getNodesByVersion().error: ' + error)
              resolve(rankedList)
            })
          }
        })
      }
    })
    .catch (error => {
      print(__filename + ': getNodesByVersion().getNodesByPing().error: ' + error)
    })
  })
}
