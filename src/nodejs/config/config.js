
const _   = require('underscore')
const dbg = require('nodejs_util/debug')

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

  if (account && account.path !== null && account.path !== '') {
    var defcfg = require(account.path)

    var pathAccounts = defcfg.accounts
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

// Load neotoosl config file outside of the repo path and get smtp details

exports.get_smtp = () => {
  var smtp = cfg.smtp

  if(smtp && smtp.path !== null) {
    var smtpCfg = require(smtp.path)
    return smtpCfg
  }
}
