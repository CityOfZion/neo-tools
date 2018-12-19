// getNep2EncryptedKey.js

// Get the NEP2 encrypted key for the account specified

require('module-alias/register')

const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
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
  .option('-n, --name [name]', 'Find account with name', '')
  .parse(process.argv);

if (program.config) {
  path = program.config
  configData = cfg.load(path)
} else configData = config

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
}

var result

if (program.name) result = account.getNep2EncryptedKey(configData, program.name)
else result = account.getNep2EncryptedKey(configData)

print('\n' + result)
