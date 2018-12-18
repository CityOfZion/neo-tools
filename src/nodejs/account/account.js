// account functionality - uses ../config/config.js to read config file from nodejs.config.json
// TODO store latest currency valuation to account storage

require('module-alias/register')

const _ = require('underscore')

const dbg     = require('nodejs_util/debug')
var cfg       = require('nodejs_config/config')
const json    = require('nodejs_util/json')

var config    = cfg.load('nodejs_config/nodejs.config.json')


// returns account in user config that has "default:" true"
exports.getDefaultAccount = () => {
  var accounts = config.accounts

  var account = _.findWhere(accounts, {default: true})

  if (account && account.path) {
    config = require(account.path) // save global config in memory for right now

    var pathAccounts = config.accounts
    return _.findWhere(pathAccounts, {default: true})
  }
}

// returns account address where "watch": true
exports.getWatchAddresses = (configData) => {
  var accounts = configData.accounts
  var results = []

  if (accounts) {
    for (var name in accounts) {
      var account = accounts[name]
      if (account && account.path && account.path.length) {
        config = require(account.path) // save global config in memory for right now

        var pathAccounts = config.accounts

        for (var name in pathAccounts) {
          if (pathAccounts[name].watch == true) {
            var o = {}
            o[name] = pathAccounts[name]
            results.push(o)
          }
        }
      }
    }
  }
  return results
}

// sets watch: true for an account with address.
// if not address exists this should add a watch address with a default account object
exports.setWatchAddresses = (address) => {
  var accounts = config.accounts

  var account = _.findWhere(accounts, {address: address})

  if (account && account.path) {
    config = require(account.path) // save global config in memory for right now

    var pathAccounts = config.accounts
    return _.findWhere(pathAccounts, {address: address})
  }
}

// Return all accounts in config.
// See accounts key of src/nodejs/config/sampmle.config.json for data structure

exports.list = (configData, accountName) => {
  var accounts = configData.accounts

  var account

  if (accountName && accounts && accounts[accountName]) account = accounts[accountName]

  else account = accounts.default

  if (account && account.path) {  // we're loading accounts from another file
    config = require(account.path) // save global config in memory for right now

    return config.accounts
  }

  // we're loading accounts from the provided configData
  return accounts
}


// Return NEP-2 encrypted key from account config data.
// This searches the data for the account with accountName and plucks that key.

exports.getNep2EncryptedKey = (configData, accountName) => {
  var accounts = this.list(configData)
  var account

  if (accountName && accounts && accounts[accountName]) account = accounts[accountName]
  else account = _.findWhere(accounts, {default: true})

  if (account && account.nep2EncryptedKey) return account.nep2EncryptedKey

  else return null
}
