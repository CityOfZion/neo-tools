// query CoinMarketCap.com for price info
require('module-alias/register')

const axios = require('axios')

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


exports.get_price = (coin = 'NEO', currency = 'usd') => {
  if (defly) console.log('retrieving: ' + `https://api.coinmarketcap.com/v1/ticker/${coin.toLowerCase()}/`)
  return axios.get('https://api.coinmarketcap.com/v1/ticker/'+ coin.toLowerCase())
    .then((mapping) => {
      const price = mapping.data[0].price_usd
      if (price) return price
      else throw new Error('Something went wrong with the CoinMarketCap API!')
    })
    .catch(err => {
      console.log(err.message)
      throw err
    })
}

exports.get_worth = (symbol, amount, currency) => {
  return this.get_price(symbol, amount, currency)
}
