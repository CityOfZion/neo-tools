// decryptNep2.js
//
// Get the NEP2 encrypted key for the account specified and return the decrypted value

// TODO Add account name description. For now it is left up to the user to know which account to supply the password for when prompted.
// TODO Add secure password parameter option or config file password option.

require('module-alias/register')

const program = require('commander')
const _       = require('underscore')
const prompt  = require('password-prompt')


const neon    = require('@cityofzion/neon-js')
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
  .option('-e, --encryptedKey [ewencryptedKeyf]', 'Rather than get the text to decrypt from config, supply it with this option', '')
  .on('--help', function(){
    print('If no account name is supplied the account marked default: true in the configuration file is used.')
  })
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
  else if (program.encryptedKey) result = program.encryptedKey
  else result = account.getNep2EncryptedKey(configData)

  prompt('password: ', { method: 'hide' }).then(password => {
    neon.wallet.decryptAsync(result, password)
      .then(wif => {
        print('\n' + wif)
      })
      .catch(e => {
        console.log('error: ' + e)
      })
  })
}
