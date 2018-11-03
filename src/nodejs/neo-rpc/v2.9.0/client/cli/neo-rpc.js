// neo-rpc.js
// CLI module interface to remote Neo RPC systems

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const netutil = require('nodejs_util/network')

var cfg       = require('nodejs_config/config.js')
var config    = cfg.load('nodejs_config/nodejs.config.json')

let nodes = []
let defly = false
let arg

function print(msg) {
  console.log(msg);
}
//
// program
//   .version('0.2.0')
//   .usage('')
//   .usage('')
//   .option('-d, --debug', 'Debug')
//   .option('-n, --node [node]', 'set RPC node to use (be sure to preface with https://), if not provided will try to use node with tallest block')
//   .option('-h, --hash [hash]', 'specify the hash of the block to fetch, if no hash or index is supplied will get the tallest')
//   .option('-i, --index [index]', 'specify the number of the block to fetch, if no hash or index is supplied will get the tallest')
//   .option('-t, --time', 'Only return time field of last block - this does not work with -T option')
//   .option('-T, --Txs', 'Only return an array of transactions for the block')
//   .option('-H, --Human', 'I am human so make outputs easy for human')
//   .option('-N, --Net [Net]', 'Select network [net]: i.e., TestNet or MainNet', 'TestNet')
//   .on('--help', function(){
//     print('OPTIMIZATION NOTE: \n\nAs of /NEO:2.8.0/, the only difference in the return value of getRawTransaction versus getBlock is three fields more in the former: blockhash, confirmations, and blocktime. Don\'t make the extra RPC call to getRawTransaction if you don\'t need to.')
//   })
//   .parse(process.argv)

netutil.debug()


let options = {
}
netutil.getRpcNodes(options)
