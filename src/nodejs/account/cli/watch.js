// set an acocunt to be watched and return watched accounts
// watching an account will show latest n transactions for an account
// and optionally its valuation at a configurable interfval


require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const stdin   = require('nodejs_util/stdin')
const json    = require('nodejs_util/json')
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
  .option('-D, --Debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')
  .option('-w, --watch', 'Only watch addresses marked watch: true in config')
  .option('-i, --interval', 'Set watch interval in seconds', 300) // default 5 mins
  .option('-s, --summary', 'Only print a summary of transactions')
  .option('-n, --number', 'View at most last n transactions')
  .option('-a, --address [address]', 'Specify the address or addresses to watch. Multiple -a arguments result in multiple iterations of the command.', collect, [])
  .option('-r, --readstdin', 'Tell the program to read addresses as JSON from stdin. By default, matches json key "address"')
  // TODO add num recent transactions option to list per addresses
  // TODO add num recent transactions option to liss persummary
  // TODO add specific address option instead of defaults in config
  // TODO add multiple exchange value lookup

  .parse(process.argv);

if (program.config) {
  path = program.config
  configData = cfg.load(path)
} else configData = config

if (program.Debug) {
  print('DEBUGGING');
}

var result = account.get_watch_addresses(configData)

if(result && result.length)
print('result:')
result.forEach((r) => {
  dbg.logDeep('', r)
})
