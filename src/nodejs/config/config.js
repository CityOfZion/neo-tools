const _ = require('underscore')

var cfg

exports.load = path => {
  cfg = require(path)

  return cfg
}

exports.save = path => {

  return cfg
}

// returns account in user config that has "default:" true"
exports.get_default_account = () => {
  var accounts = cfg.accounts

  var account = _.findWhere(accounts, {default: true})

  if(account && account.path !== null) {
    cfg = require(account.path)

    var pathAccounts = cfg.accounts
    return _.findWhere(pathAccounts, {default: true})
  }
}

// Load neotools config file outside of the repo path
exports.get_exchanges = () => {
  var exchanges = cfg.exchanges

  if(exchanges && exchanges.path !== null) {
    var extCfg = require(exchanges.path)
    return extCfg
  }
}
