const util = require('util')

exports.lookDeep = (o) => {
  return util.inspect(o, { depth: null })
}

// TODO implement automatic argument passing option— see below
// I.e., if !msg, use argument.callee/caller for tracing and argument.name(?) for printing
exports.logDeep = (msg, o) => {
  console.log(msg + ' ' + this.lookDeep(o))
}
