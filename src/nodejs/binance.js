// binance.com support module

// be sure to watch for weight response
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md




const axios = require('axios')
const dbg = require('./debug')
const _ = require('underscore')


// query binance.com for price info
// Weight 1

exports.get_price = (coin = 'neousdt', currency = 'usd') => {
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



// query binance.com for est price/qty on the order book for a symbol or symbols.
// Weight 1

exports.get_book = (coin = 'neousdt', currency = 'usd') => {
  console.log('retrieving: ' + 'https://api.binance.com/api/v3/ticker/bookTicker')
  return axios.get('https://api.binance.com/api/v3/ticker/bookTicker')
    .then((mapping) => {
      const res = _.findWhere(mapping.data, {'symbol': coin.toUpperCase()})
      if (res) return res
      else return mapping.data
    })
    .catch(err => {
      console.log(err.message)
      throw err
    })
}

// get account information (USER_DATA: Requires signed endpoint security)
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
// SIGNED endpoints require an additional parameter, signature, to be sent in the query string or request body.
// Endpoints use HMAC SHA256 signatures. The HMAC SHA256 signature is a keyed HMAC SHA256 operation. Use your secretKey as the key and totalParams as the value for the HMAC operation.
// The signature is not case sensitive.
// totalParams is defined as the query string concatenated with the request body.
 // exports.get_account_info =
