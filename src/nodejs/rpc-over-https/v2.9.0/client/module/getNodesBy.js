// getNodesBy.js

// Module for helping get Neo Smart Economy RPC node servers

// TODO move per instance callback functions out of function scope to make accessible to reuse
// TODO review ssl issue
// TODO look at dynamic selection defaults
// TODO Look at ping toggle for "all" method

require('module-alias/register')

const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var neon      = require('@cityofzion/neon-js')

const netUtil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let node  = ''
let defly = false
let maxPing = 2000


function print(msg) {
  console.log(msg);
}
exports.debug = (debug) => {
  if (debug !== undefined) defly = debug
  else defly = !defly
  if (defly) print(__filename + ': API debugging enabled')
  else print(__filename + ': This is your last debugging message! API debugging disabled')
}

exports.configure = (cfgObj) => {
  ({ maxPing } = cfgObj)
  if (defly) print('max ping timeout set to: ' + maxPing)
}

// Select RPC nodes on options.net by options.byFunc
// TODO: redesign
// byFunc is one of any of the getNodesBy[name] functions in this module, i.e., ping
// Returns a promise of an array that is empty or full of sorted nodes.
// This will ALWAYS ping.

exports.getRpcNodes = (options) => {
  let opts = options ? options : opts = {}

  opts.net ? opts.net : opts.net = 'TestNet'
  opts.byFunc ? opts.byFunc : opts.byFunc = 'getNodesByPing'

  let byFunc = opts.byFunc
  let net    = netUtil.resolveNetworkId(opts.net)
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


// Return an array of nodes sorted by ping
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'asc',                                   // asc = lowest value first, dsc = highest first
//  }
// TODO: add caching with configurable time limit for results

exports.ping = (options) => {
  let rankedList = [], i = 0
  // let opts = options ? options : opts = {}
  //
  // opts.net ? opts.net : opts.net = 'TestNet'
  // opts.order ? opts.order : opts.order = 'asc'
  //
  // // let net    = netUtil.resolveNetworkId(opts.net)
  // // let cfgNodes  = cfg.getNodes(net)
  //
  // opts.nodes ? opts.nodes : opts.nodes = cfgNodes

  let nodes = options.nodes

  if (defly) {
    // dbg.logDeep(__filename + ': getNodesByPing().options: ', opts)
    // dbg.logDeep(__filename + ': getNodesByPing().net: ', net)
    dbg.logDeep(__filename + ': getNodesByPing().cfg.GetNodes(): ', nodes)
  }

  return new Promise((resolve, reject) => {
    if (_.isArray(nodes)) {
      nodes.forEach((n) => {
        if (n.url) {
          print('neon-js ping: ' + n.url)

          const client = neon.default.create.rpcClient(n.url)

          client.ping().then(ms => {
            i++
            if (ms < maxPing) {
              rankedList.push({ "url": n.url, "ping": ms })
            } else {
              print('[-] ' + n.url + ' ms: ' + ms + ' is greater than max ping: ' + maxPing)
            }

            if (i === nodes.length) {
              rankedList = _.sortBy(rankedList, 'ping')
              // sort by descending
              if (options.order === 'dsc') rankedList = rankedList.reverse()
              resolve(rankedList)
            }
          })
          .catch(error => {
            i++
            print(__filename + ': getNodesBy.ping().error: ' + error)

            if (i === nodes.length) {
              rankedList = _.sortBy(rankedList, 'ping')
              if (options.order === 'dsc') rankedList = rankedList.reverse()
              resolve(rankedList)
            }
          })
        }
      })
    }
  })
}


// Return an array of nodes sorted by tallest
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'dsc',                                   // asc = lowest value first, dsc = highest first
//    ping: 1                                         // ping first, default true
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()

exports.tallest = (options) => {
  let rankedList = [], i = 0, pingOptions = {}
  Object.assign(pingOptions, options)
  pingOptions.order = 'asc'

  return new Promise((resolve, reject) => {
    if (parseInt(options.ping)) {
      this.ping(pingOptions).then(nodes => {
        tallestCallback(nodes)
      })
      .catch (error => {
        print(__filename + ': getNodesBy.tallest()/getNodesBy.ping().error: ' + error)
      })
    } else {
      tallestCallback(options.nodes)
    }

    function tallestCallback(nodes) {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            print('rpc query getblockcount: ' + n.url)

            const client = neon.default.create.rpcClient(n.url)

            client.getBlockCount().then(response => {
              i++
              if (response) rankedList.push({ 'url': n.url, 'height': response, 'ping': n.ping })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'height')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': ' + n.url + '.getNodesBy.tallest().error: ' + error)

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'height')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
          }
        })
      }
    }
  })
}


// Return an array of nodes sorted by connections
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'asc',                                   // asc = lowest value first, dsc = highest first
//    ping: 1                                         // ping first, default true
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()

exports.connection = (options) => {
  let rankedList = [], i = 0, pingOptions = {}
  Object.assign(pingOptions, options)
  pingOptions.order = 'asc'

  return new Promise((resolve, reject) => {
    if (parseInt(options.ping)) {
      this.ping(pingOptions).then(nodes => {
        connectionCallback(nodes)
      })
      .catch (error => {
        print(__filename + ': getNodesBy.connections()/getNodesBy.ping().error: ' + error)
      })
    }
    else {
        connectionCallback(options.nodes)
    }

    function connectionCallback(nodes) {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            print('rpc query getconnections: ' + n.url)

            const client = neon.default.create.rpcClient(n.url)

            client.getConnectionCount().then(response => {
              i++
              if (response) rankedList.push({ 'url': n.url, 'connections': response, 'ping': n.ping })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'connections')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': ' + n.url + '.getNodesBy.connections().error: ' + error)

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'connections')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
          }
        })
      }
    }
  })
}


// Return an array of nodes sorted by version
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'dsc',                                   // asc = lowest value first, dsc = highest first
//    ping: 1                                         // ping first, default true
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()

exports.version = (options) => {
  let rankedList = [], i = 0, pingOptions = {}
  Object.assign(pingOptions, options)
  pingOptions.order = 'asc'

  return new Promise((resolve, reject) => {
    if (parseInt(options.ping)) {
      this.ping(pingOptions).then(nodes => {
        versionCallback(nodes)
      })
      .catch (error => {
        print(__filename + ': getNodesBy.version()/getNodesBy.ping().error: ' + error)
      })
    }
    else {
      versionCallback(options.nodes)
    }

    function versionCallback(nodes) {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            print('rpc query getversion: ' + n.url)

            const client = neon.default.create.rpcClient(n.url)

            client.getVersion().then(response => {
              i++
              if (response) rankedList.push({ 'url': n.url, 'version': response, 'ping': n.ping })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'version')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': ' + n.url + '.getNodesBy.version().error: ' + error)

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'version')
                // if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
          }
        })
      }
    }
  })
}


// Return an array of nodes sorted by getrawmempool
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'asc',                                   // asc = lowest value first, dsc = highest first
//    ping: 1                                         // ping first, default true
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()

exports.rawmempool = (options) => {
  let rankedList = [], i = 0, pingOptions = {}
  Object.assign(pingOptions, options)
  pingOptions.order = 'asc'

  return new Promise((resolve, reject) => {
    if (parseInt(options.ping)) {
      this.ping(pingOptions)
        .then(nodes => {
          rawmempoolCallback(nodes)
        })
        .catch (error => {
          print(__filename + ': getNodesBy.rawmempool()/getNodesBy.ping().error: ' + error)
        })
    } else {
      rawmempoolCallback(options.nodes)
    }

    function rawmempoolCallback(nodes) {
      if (_.isArray(nodes)) {
        nodes.forEach((n) => {
          if (n.url) {
            print('rpc query getrawmempool: ' + n.url)

            const client = neon.default.create.rpcClient(n.url)

            client.getRawMemPool().then(response => {
              i++
              if (response) rankedList.push({ 'url': n.url, 'rawmempool': response.length, 'ping': n.ping })

              if (i === nodes.length) {
                rankedList = _.sortBy(rankedList, 'rawmempool')
                if (options.order === 'dsc') rankedList = rankedList.reverse()
                resolve(rankedList)
              }
            })
            .catch(error => {
              i++
              print(__filename + ': getNodesBy.rawmempool(' + n.url + ').error: ' + error)
              if (options.order === 'dsc') rankedList = rankedList.reverse()
              resolve(rankedList)
            })
          }
        })
      }
    }
  })
}


// Return an object list of nodes with all stats this module can provide by default
// or according to an array of method names as strings, i.e.: ["height", "tallest"]
//
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'asc'                                    // asc = lowest value first, dsc = highest first
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()
// Return Value Format:
// { 'nodeurl': { 'url': url, 'height': height, 'version': version, 'connections': connectionsCount, 'rawmempool': rawmempoolLength}}

exports.run = (options, methods) => {
  let list = {}, objCopy, results = {}

  let getTallest = this.tallest
  getTallest.keyName = 'height'

  let getConnections = this.connection
  getConnections.keyName = 'connections'

  let getVersion = this.version
  getVersion.keyName = 'version'

  let getRawMemPool = this.rawmempool
  getRawMemPool.keyName = 'rawmempool'

  let operations = []

  if (methods && methods.length) {
    methods.forEach(method => {
      if (method === "height") operations.push(getTallest)
      else if (method === "connections") operations.push(getConnections)
      else if (method === "version") operations.push(getVersion)
      else if (method === "rawmempool") operations.push(getRawMemPool)
    })
  }
  else operations = [getTallest, getConnections, getVersion, getRawMemPool]

  return new Promise((resolve, reject) => {
    operations.forEach((op, outerIndex) => {
      op(options).then(rankedNodes => {
        list[op.keyName] = rankedNodes

        if (outerIndex === operations.length-1) {
          operations.forEach(op => {

            if (op && op.keyName && list[op.keyName]) {
              list[op.keyName].forEach(node => {
                operations.forEach((op2, innerIndex) => {
                  list[op2.keyName].forEach(node2 => {
                    if (node.url === node2.url) {
                      objCopy = Object.assign(node, node2)
                      results[node.url] = objCopy
                    }
                  })
                  if (innerIndex === operations.length-1) {
                    resolve(results)
                  }
                })
              })
            } else reject('something went wrong: ' + op.keyName)
          })
        }
      })
    })
  })
}

// Return an object list of nodes with all stats this module can provide by default
//
// ARGS:
//  options = {
//    net: 'TestNet',                                 // default network
//    nodes: [{ 'url': 'https://host.domain:port' }], // defaults to empty
//    order: 'asc'                                    // asc = lowest value first, dsc = highest first
//  }
// TODO: add caching with configurable time limit for results
// This will ALWAYS ping first with getNodesBy.ping()
// Return Value Format:
// { 'nodeurl': { 'url': url, 'height': height, 'version': version, 'connections': connectionsCount, 'rawmempool': rawmempoolLength}}

exports.all = (options, methods) => {
  let list = {}, objCopy, results = {}

  let getTallest = this.tallest
  getTallest.keyName = 'height'

  let getConnections = this.connection
  getConnections.keyName = 'connections'

  let getVersion = this.version
  getVersion.keyName = 'version'

  let getRawMemPool = this.rawmempool
  getRawMemPool.keyName = 'rawmempool'

  let operations = [getTallest, getConnections, getVersion, getRawMemPool]

  return new Promise((resolve, reject) => {
    operations.forEach((op, outerIndex) => {
      op(options).then(rankedNodes => {
        list[op.keyName] = rankedNodes

        if (outerIndex === operations.length-1) {
          operations.forEach(op => {

            if (op && op.keyName && list[op.keyName]) {
              list[op.keyName].forEach(node => {
                operations.forEach((op2, innerIndex) => {
                  list[op2.keyName].forEach(node2 => {
                    if (node.url === node2.url) {
                      objCopy = Object.assign(node, node2)
                      results[node.url] = objCopy
                    }
                  })
                  if (innerIndex === operations.length-1) {
                    resolve(results)
                  }
                })
              })
            } else reject('something went wrong: ' + op.keyName)
          })
        }
      })
    })
  })
}
