// Get the NEP2 encrypted key for the account specified

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const cmc     = require('nodejs_market/coinmarketcap/get_price')
const binance = require('nodejs_exchange/binance/binance-api.js')
var cfg       = require('nodejs_config/config')
var account   = require('nodejs_account/account')

const json    = require('nodejs_util/json')

var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg);
}

var configData

program
  .version('0.1.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')
  .option('-w, --watch', 'Only list watch addresses i.e., marked watch: true in config')
  .option('-n, --name [name]', 'Find account with name', '')
  .parse(process.argv);

if (program.config) {
  path = program.config
  configData = cfg.load(path)
} else configData = config

if (program.Debug) {
  print('DEBUGGING');
}

if (program.watch) {
  var accounts = account.getWatchAddresses(configData)

  if (accounts && accounts.length) {
    print('result:')
    accounts.forEach((o) => {
      dbg.logDeep('', o)
    })
  }
} else {
  var result

  if (program.name) result = account.getNep2EncryptedKey(configData, program.name)
  else result = account.getNep2EncryptedKey(configData)

  print('\n' + result)
}
