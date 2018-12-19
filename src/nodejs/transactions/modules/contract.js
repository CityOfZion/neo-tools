// transactions/modules/contract module
// is called by transactions/cli/contract.js
//
// This uses neon-js to create a contract transaction hex id 0x80 System Fee 0
//
// See http://docs.neo.org/en-us/network/network-protocol.html for details

require('module-alias/register')

const _       = require('underscore')
const neon    = require('@cityofzion/neon-js')
const prompt  = require('password-prompt')

const dbg     = require('nodejs_util/debug')
var cfg       = require('nodejs_config/config.js')
var account   = require('nodejs_account/account')

var config    = cfg.load('nodejs_config/nodejs.config.json')

// Pass an object named config of the following format to control module behavior
// program.Debug    // Toggle debugging
// program.name     // get the account named name from config file
// program.encryptedKey // specify the encrypted key to use instead of using config data

exports.run = (config) => {
  let program = {}

  if (config) program = config
  else {
    program.Debug = false
    program.name = ''
    program.encryptedKey = ''
  }

  if (program.Debug) dbg.logDeep('config: ', config)

  return new Promise((resolve, reject) => {
    var config    = cfg.load('nodejs_config/nodejs.config.json')

    let defly = false

    function print(msg) {
      console.log(msg)
    }

    if (program.Debug) {
      print('DEBUGGING: ' + __filename)
      defly = true
    }

    var result

    if (program.name) result = account.getNep2EncryptedKey(config, program.name)
    else if (program.encryptedKey) result = program.encryptedKey
    else result = account.getNep2EncryptedKey(config)

    prompt('password: ', { method: 'hide' }).then(password => {
      neon.wallet.decryptAsync(result, password)
        .then(wif => {
          resolve(wif)
        })
        .catch(e => {
          reject(e)
        })
    })
  })
}
