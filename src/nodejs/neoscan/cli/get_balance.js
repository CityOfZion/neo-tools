// neoscan get_balance

require('module-alias/register')

const program = require('commander');
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const stdin   = require('nodejs_util/stdin')
const json    = require('nodejs_util/json')
const neoscan = require('nodejs_neoscan/neoscan')
var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg)
}

var addresses = [], address = []

function collect(val) {
  address.push(val);
  return address;
}

program
  .version('0.1.0')
  .usage('-a [address] -n [net]')
  .option('-d, --debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address [address]', 'Specify the address for balance inquiry. Multiple -a arguments result in multiple iterations of the command.', collect, [])
  .option('-r, --readstdin', 'Tell the program to read addresses as JSON from stdin. By default, matches json key "address"')
    // TODO add option to modifiy the pattern used for the key to match addresses when using -r for json
  .parse(process.argv)

if (program.debug) {
  print('DEBUGGING')
}

// read address from json on stdin using pattern provided at cli arg, if present
if (program.readstdin) {
  stdin.parseJsonFromStdin().then((r) => {
    json.findAllKeysWhere(r, 'address', (k, v) => {
      addresses.push(v)
    })
    fetch()
  })
} else if (program.address) {
  if (address.length) {
    address.forEach((addy) => {
      addresses.push(addy)
    })
  }
  fetch()

  // check for a default address in config, if not pressent show help
} else {
  var default_account = cfg.get_default_account()
  if (default_account) {
    addresses.push(default_account.address)
    fetch()
  }
  else program.help()
}


function fetch() {
  neoscan.set_net(program.net)

  if (addresses.length){
    addresses.forEach((address) => {
      neoscan.get_balance(address).then(result => {
        print('\naddress: ' + address)
        dbg.logDeep('result:\n', result)
      })
    })
  }
}
