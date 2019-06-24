// rpc query in neon-js
//
require('module-alias/register')

const program = require('commander')
const _       = require('underscore')

var neon      = require('@cityofzion/neon-js')
const dbg     = require('nodejs_util/debug')

let args
let defly = false

function print(msg) {
  console.log(msg);
}

program
  .version('0.1.0')
  .usage('-n <node>')
  .option('-D, --Debug', 'Debug')
  .option('-n, --node <node>', 'set RPC node to use (be sure to preface with https://)')
  .option('-m, --method <method>', 'set RPC method to use')
  .option('-p, --parms [parms]', 'set string of arguments rpc method parms (comma-separated, no spaces "arg0,..,argN")')
  .parse(process.argv)

if (!program.node || !program.method) {
  program.help()
}
if (program.parms) {
  let s = program.parms
  dbg.logDeep('args: ', s)
  args = s.split(',')
  dbg.logDeep('args: ', args)
}

if (program.Debug) {
  print('DEBUGGING: ' + __filename)
  defly = true
  print('program.node: '+program.node+'\nprogram.method: '+'\nprogram.args: '+program.args)
}

const query = neon.default.create.query({method: program.method, params: args})
query.execute(program.node).then(response => {
  dbg.logDeep(' ', response)
})
