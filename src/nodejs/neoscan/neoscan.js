// Neoscan.js
// This contains utility helpers for accessing Neoscan API

// TODO abstract api choice into an api config option and dynamically map to selected at runtime
// TODO composable url retrieval

const axios = require('axios')
const logDeep = require('../debug')
const Promise = require('bluebird')


const { URL } = require('url');

// TODO Reintegrate this (neoscanIni bits) with state tree

let neoscanIni = {}

neoscanIni.active = {}
neoscanIni.mainNet = {}
neoscanIni.mainNet.rootUrl = 'https://neoscan.io/api/main_net/'
neoscanIni.mainNet.txByIdUrl = 'https://neoscan.io/api/main_net/v1/get_transaction/'
neoscanIni.mainNet.txsByAddressUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
neoscanIni.mainNet.balanceUrl = 'https://neoscan.io/api/main_net/v1/get_balance/'
neoscanIni.mainNet.balanceUrl = 'https://neoscan.io/api/main_net/v1/get_balance/'

neoscanIni.testNet = {}
neoscanIni.testNet.rootUrl = 'https://neoscan-testnet.io/api/test_net/'
neoscanIni.testNet.txByIdUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/'
neoscanIni.testNet.txsByAddressUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/'
neoscanIni.testNet.balanceUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_balance/'

// Stub this out for any custom net that may come along.
// Rather than make these an array, let's create them by a custom name right on the object - neoscainIni.myCustom, for example
// Then just set neoscanIni.active to that entry.
// Store the whole thing for later management.
neoscanIni.custom = {}
neoscanIni.custom.rootUrl = 'https://neoscan-testnet.io/api/test_net/'
neoscanIni.custom.txByIdUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_transaction/'
neoscanIni.custom.txsByAddressUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_last_transactions_by_address/'
neoscanIni.custom.balanceUrl = 'https://neoscan-testnet.io/api/test_net/v1/get_balance/'

let curState = {}

// ../storage.js adds this as a subscriber to listen for state changes.
// I'm not sure this is the right approach as we still can't sync state yet.
// TODO figure out how to sync state and do this whole bit properly
exports.syncState = state => {
  curState = state
}

// Check if our url is properly formed. If url can't construct it in try, it isn't.
const validateUrl = url => {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url)
      console.log('host: ' + u)
      resolve(url)
    } catch (error) {
      console.log('neoscan: validateUrl: ' + error.message)
      reject(error)
    }
  })
}

exports.set_net = networkId => {
  return this.switchNetwork(networkId)
}

// MAKE GAS PERDY

exports.formatGas = gasArray => {
  let gas
  if (gasArray.length === 1) {
    gas = gasArray[0] / 100000000000000
  } else {
    gas = gasArray[1] > 0 ? Number(gasArray.join('.')).toFixed(5) : Number(gasArray.join('.'))
  }

  return gas
}

exports.switchNetwork = networkId => {
  let net
  switch (networkId) {
    case 'main_net':
    case 'mainnet':
    case 'MainNet':
      if (curState && curState.config && curState.config.neoscan) {
        net = curState.config.neoscan.active = curState.config.neoscan.mainNet
      } else {
        curState = {
          config: {
            neoscan: {
              active: neoscanIni.mainNet,
            },
          },
        }
        net = curState.config.neoscan.active
      }
      break
    case 'test_net':
    case 'testnet':
    case 'TestNet':
      if (curState && curState.config && curState.config.neoscan) {
        net = curState.config.neoscan.active = curState.config.neoscan.testNet
      } else {
        curState = {
          config: {
            neoscan: {
              active: neoscanIni.testNet,
            },
          },
        }
        net = curState.config.neoscan.active
      }
      break
    default:
      if (!networkId) return undefined

      if (curState && curState.config && curState.config.neoscan && curState.config.networks && curState.config.networks[networkId]) {
        net = curState.config.neoscan.active = curState.config.networks[networkId]
      } else {
        // if (curState.config.neoscan[networkId].apiType !== 'neoscan') return undefined
        console.log('networkId: ' + networkId)
        let u = curState.config.neoscan[networkId].url
        let custom = {}
        custom.name = curState.config.neoscan[networkId].name
        custom.rootUrl = u + '/api/test_net/'
        custom.txByIdUrl = u + '/api/test_net/v1/get_transaction/'
        custom.txsByAddressUrl = u + '/api/test_net/v1/get_last_transactions_by_address/'
        custom.balanceUrl = u + '/api/test_net/v1/get_balance/'
        custom.canDelete = true
        custom.apiType = 'neoscan'
        curState = {
          config: {
            neoscan: {
              active: custom,
            },
          },
        }
        net = curState.config.neoscan.active
        logDeep('net', net)
      }
      break
  }
  return net
}

// Returns the full URL all the way up to the version.
// I.e., 'https://neoscan.io/api/main_net/'

exports.getRootUrl = () => {
  return validateUrl(curState.config.neoscan.active.rootUrl)
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_transaction/'

exports.getTxByIdUrl = txid => {
  if (txid) {
    return validateUrl(curState.config.neoscan.active.txByIdUrl + '/' + txid + '/')
  } else {
    return validateUrl(curState.config.neoscan.active.txByIdUrl)
  }
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
// TODO add page argument format = address + '/' + page

exports.get_last_transactions_by_address_url = (address, page) => {
  if (address) return validateUrl(curState.config.neoscan.active.txsByAddressUrl + '/' + address + '/' + page)
  else return validateUrl(curState.config.neoscan.active.txsByAddressUrl)
}



// Get all transactions for an address

exports.get_last_transactions_by_address = (address, page) => {
  let pageArg = ''
  if(page) pageArg = page
  return new Promise((resolve, reject) => {
    this.get_last_transactions_by_address_url(address, pageArg).then(url => {
      console.log(url)
      return axios
        .get(url)
        .then(response => {
          console.log(`Retrieved History for ${address} from neoscan ${url}`)
          response.data.address = address
          resolve({ data: response.data, address: address })
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

// Get a single transaction

exports.getTxById = txid => {
  return new Promise((resolve, reject) => {
    getTxByIdUrl(txid).then(url => {
      console.log(`Retrieving ${txid} History from neoscan ${url}`)
      return axios
        .get(url)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

// Returns the full URL all the way up to the args.
// I.e., 'https://neoscan.io/api/main_net/v1/get_transaction/'

exports.get_balance_url = address => {
  console.log(curState.config.neoscan.active.balanceUrl, address)
  if (address) {
    return validateUrl(curState.config.neoscan.active.balanceUrl + '/' + address + '/')
  } else return validateUrl(curState.config.neoscan.active.balanceUrl)
}

exports.get_balance = address => {
  return new Promise((resolve, reject) => {
    this.get_balance_url(address).then(url => {
      console.log(`Retrieving balance for ${address} from neoscan ${url}`)
      return axios
        .get(url)
        .then(response => {
          let assets = {}
          let data = response.data
          if (data.address === 'not found') {
            assets = {
              neo: 0,
              gas: 0,
            }
          } else {
            // TODO rewrite to dynamically populate assets
            data.balance.map(b => {
              // switch (b.asset) {
              //   case 'NEO':
              //     neo = b.amount
              //     break
              //   case 'GAS':
              //     gas = '' + b.amount
              //     break
              //   case 'Redeemable HashPuppy Token':
              //     rht = '' + b.amount
              //     console.log('rht: '+ rht)
              //     break
              //   case 'Master Contract Token':
              //     mct = '' + b.amount
              //     console.log('mct: '+ mct)
              //     break
              // }

              let ast = {}
              ast[b.asset] = b.amount

              if (b.asset === 'NEO') {
                assets['neo'] = b.amount
              } else if (b.asset === 'GAS') {
                assets['gas'] = b.amount
              } else if (b.amount) {
                assets[b.asset] = b.amount
              }
            })
          }
          resolve(assets)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

exports.parseUnspent = unspentArr => {
  return unspentArr.map(coin => {
    return {
      index: coin.n,
      txid: coin.txid,
      value: coin.value,
    }
  })
}


exports.get_height_url = () => {
  return validateUrl(curState.config.neoscan.active.rootUrl + '/v1/get_height')
}

// Get block block_height

exports.get_height = () => {
  return new Promise((resolve, reject) => {
    this.get_height_url().then(url => {
      console.log(`Retrieving block height`)
      return axios
        .get(url)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

exports.get_all_nodes_url = () => {
  return validateUrl(curState.config.neoscan.active.rootUrl + '/v1/get_all_nodes')
}

// Get block block_height

exports.get_all_nodes = () => {
  return new Promise((resolve, reject) => {
    this.get_all_nodes_url().then(url => {
      console.log(`Retrieving node list`)
      return axios
        .get(url)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  })
}

// TODO: implement change code from TransactionList/index.js here to hide business from pres
// function parseTxHistory (rawTxs, address) {
//   return rawTxs.map(tx => {
//     const vin = tx.vin.filter(i => i.address_hash === address)
//     const vout = tx.vouts.filter(o => o.address_hash === address)
//     const change = {
//       NEO: vin.filter(i => i.asset === Neon.CONST.ASSET_ID.NEO).reduce((p, c) => p.add(c.value), new Fixed8(0)),
//       GAS: vout.filter(i => i.asset === Neon.CONST.ASSET_ID.GAS).reduce((p, c) => p.add(c.value), new Fixed8(0))
//     }
//       txid: tx.txid,
//       blockHeight: new Fixed8(tx.block_height),
//       change
//     }
//   })
// }
