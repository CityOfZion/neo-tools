// account/cli/decryptNep2.js cli module
//
// This calls account/modules/decryptNep2.js
// Get the NEP2 encrypted key for the account specified and return the decrypted value

// TODO Add account name description. For now it is left up to the user to know which account to supply the password for when prompted.
// TODO Add secure password parameter option or config file password option.

require('module-alias/register')

const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
var cfg       = require('nodejs_config/config')
var account   = require('nodejs_account/account')

const decryptNep2 = require('nodejs_account/modules/decryptNep2')

var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg);
}

let configData
let defly = false

program
  .version('0.1.0')
  .usage('')
  .option('-D, --Debug', 'Debug')
  .option('-c, --config [config]', 'Specify a config file to use')
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
  print('DEBUGGING: ' + __filename)
  defly = true
}

let runtimeArgs = {
  'Debug': defly,
  'name': program.name ? program.name : '',
  'encryptedKey': program.encryptedKey ? program.encryptedKey : ''
}

if (defly) dbg.logDeep('runtimeArgs: ', runtimeArgs)

decryptNep2.run(runtimeArgs)
  .then((r) => {
    dbg.logDeep(' ', r)
  })
  .catch(e => {
    print('error: ' + e)
  })
