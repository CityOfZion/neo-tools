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
  if (defly) console.log('neoscan api debugging enabled')
  else console.log('This is your last debugging message! neoscan api debugging disabled')
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
  let i = 0, errors = 0, highPings = 0
  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          if (defly) print('getting node height for: ' + n.url)

          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            if (defly) print(n.url + ' ms: ' + ms)

            if (ms < maxPing) {
              client.getBlockCount().then(response => {
                if (response) rankedList.push({ "url": n.url, "height": response })

                if (defly) {
                  print('n: ' + n.url)
                  print('response: ' + response)
                  print('loop i: ' + i)
                  print('errors: ' + errors)
                  print('node n: ' + nodes.length)
                }

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
            if (defly) print(n.url + ' ms: ' + ms)

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
            if (defly) print(n.url + ' ms: ' + ms)

            if (ms < maxPing) {
              client.getVersion().then(response => {
                if (response) rankedList.push({ "url": n.url, "version": response })
                if ((i++ === (nodes.length - 1)) || (i === (nodes.length - highPings))) {
                  rankedList = _.sortBy(rankedList, 'version')
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


// Return an array of nodes sortyed with lowest pings first
// This expects an array of nodes with keys named "url"
// TODO: add caching with configurable time limit for results

exports.getNodesByPing = (nodes) => {
  let rankedList = []
  let i = 0, errors = 0, highPings = 0

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            if (defly) print(n.url + ' ms: ' + ms)

            if (ms < maxPing) {
              rankedList.push({ "url": n.url, "ping": ms })

              if ((i++ === (nodes.length - 1)) || (i === (nodes.length - highPings))) {
                rankedList = _.sortBy(rankedList, 'ping')
                resolve(rankedList)
              }
            } else {
              highPings++
            }
          }).catch(error => {
            print('error: ' + error)
            errors++
          })
        }
      })
    }
  })
}
