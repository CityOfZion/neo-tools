// chainSync.js
// module interface to neo-js block synchronizer
// https://github.com/cityofzion/neo-js
// This is called by nodejs/neo-js/cli/chainSync.js CLI wrapper

require('module-alias/register')

const _       = require('underscore')
const Neo     = require('@cityofzion/neo-js').Neo

const netUtil = require('nodejs_util/network')
const dbg     = require('nodejs_util/debug')


// Pass an object named config of the following format to control module behavior
// program.debug    // Toggle debugging
// program.human    // Make dates human-readable
// program.net      // This is the network to run on

exports.run = (config) => {
  let program = {}
  let defly = false
  let arg

  if (config) program = config
  else {
    program.debug = false
    program.net = 'testnet'
    program.human = false
  }

  function print(msg) {
    console.log(msg);
  }

  if (program.debug) {
    print('DEBUGGING: ' + __filename)
    defly = true
  }

  if (defly) {
    dbg.logDeep('cfg: ', config)
  }
  return new Promise((resolve, reject) => {
    const options = {
      'network': program.net,
      'storageType': program.storage,
      'storageOptions': {
        'connectionString': program.connection,
      },
    }

    // Create a neo instance
    const neo = new Neo(options)

    // Get block count
    neo.storage.on('ready', () => {
      neo.storage.getBlockCount()
        .then((res) => {
          print('Block count:', res)
        })
    })
  })
}
