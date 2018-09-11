// set an acocunt to be watched and return watched accounts

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const cmc     = require('nodejs_market/coinmarketcap/get_price')
const binance = require('nodejs_exchange/binance/binance-api.js')
var cfg       = require('nodejs_config/config')
var account   = require('nodejs_account/account')

var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('')
  .option('-d, --debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')
  // TODO add num recent transactions option to list per addresses
  // TODO add specific address option instead of defaults in config
  // TODO add multiple exchange value lookup

  .parse(process.argv);

if (program.config) {
  path = program.config
  configData = cfg.load(path)
} else configData = config

if (program.debug) {
  print('DEBUGGING');
}

var result = account.get_watch_addresses(configData)

if(result && result.length)
print('result:')
result.forEach((r) => {
  dbg.logDeep('', r)
})
