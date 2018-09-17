// stdin.js
// This module provides a standard standar input (stdin) interface for all
// CLI modules.

require('module-alias/register')

const dbg     = require('nodejs_util/debug')
var readline  = require('readline')
const Promise = require('bluebird')
const json    = require('nodejs_util/json')


// Read stdin as string of json and return an object
// Look for "result:" on stdin
// Everything after that will be json text

exports.parseJsonFromStdin = () => {
  return new Promise((resolve, reject) => {
    var obj = {}
    var jsonstr = ''
    var ready = false

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    rl.on('line', (line) => {
      if (line === 'result:') {
        line = ''
        ready = true
      }
      if (ready) jsonstr += line
    })

    rl.on('close', () => {
      rl.close()
      if (ready) resolve(JSON.parse(json.quoteJSON(jsonstr)))
    })
  })
}
