// query binance.com for price info

// be sure to watch for weight response
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md




const axios = require('axios')
const dbg = require('./debug')
const _ = require('underscore')


// Weight 1

exports.get_price = (coin = 'NEO', currency = 'usd') => {
  console.log('retrieving: ' + 'https://api.binance.com/api/v3/ticker/price')
  return axios.get('https://api.binance.com/api/v3/ticker/price')
    .then((mapping) => {
      // const price = mapping.data[0].price_usd
      // dbg.logDeep('map: ', mapping)
      const res = _.findWhere(mapping.data, {'symbol': coin.toUpperCase()})
      // dbg.logDeep('map: ', res)

      if (res && res.price) return res.price
      else return mapping.data
    })
    .catch(err => {
      console.log(err.message)
      throw err
    })
}

exports.get_worth = (symbol, amount, currency) => {
  return this.get_price(symbol, amount, currency)
}
