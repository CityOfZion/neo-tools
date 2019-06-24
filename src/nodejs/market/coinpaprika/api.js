// query coinpaprika.com for price info


require('module-alias/register')

const CoinpaprikaAPI = require('@coinpaprika/api-nodejs-client')

const dbg = require('nodejs_util/debug')

var defly = false

// Run this to configure API
// debug = true | turns on verbose activity console printing

exports.debug = (debug) => {
  if (debug !== undefined) defly = debug
  else defly = !defly
  if (defly) console.log(__filename + ': api debugging enabled')
  else console.log(__filename + ': This is your last debugging message! Api debugging disabled')
}


exports.getTicker = (coin = 'NEO', currency = 'usd') => {
  let options = {
    'coinId': coin
  }
  const client = new CoinpaprikaAPI();

  return new Promise((resolve, reject) => {
    client.getTicker(options)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
    })
  })
}

exports.getWorth = (symbol, amount, currency) => {
  return this.getTicker(symbol, amount, currency)
}


exports.getQuotes = () => {
  return this.getTicker(symbol)

}
