const axios = require('axios')
const dbg = require('./debug')


exports.get_price = (coin = 'NEO', currency = 'usd') => {
  console.log('retrieving: ' + `https://api.coinmarketcap.com/v1/ticker/${coin.toLowerCase()}/`)
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
