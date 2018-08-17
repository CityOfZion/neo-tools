const _ = require('underscore')

var cfg

exports.load = path => {
  cfg = require(path)

  return cfg
}


exports.get_default_account = () => {
  var accounts = cfg.accounts

  var account = _.findWhere(accounts, {default: true})

  if(account && account.path !== null) {
    cfg = require(account.path)

    var pathAccounts = cfg.accounts
    return _.findWhere(pathAccounts, {default: true})
  }
}
