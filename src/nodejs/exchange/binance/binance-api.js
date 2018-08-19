// binance.com api module

// be sure to watch for weight response
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

require('module-alias/register')

const axios       = require('axios')
const _           = require('underscore')
const hmacSHA256  = require("crypto-js/hmac-sha256");

const dbg         = require('nodejs_util/debug')

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
      else console.log('Please provide a valid Binance symbol.')
      return null
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

exports.get_book_ticker = (coin = 'neousdt', currency = 'usd') => {
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

// get asset_detail (USER_DATA: Requires signed endpoint security)
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
// SIGNED endpoints require an additional parameter, signature, to be sent in the query string or request body.
// Endpoints use HMAC SHA256 signatures. The HMAC SHA256 signature is a keyed HMAC SHA256 operation. Use your secretKey as the key and totalParams as the value for the HMAC operation.
// The signature is not case sensitive.
// totalParams is defined as the query string concatenated with the request body.
// secret is the binance secret key you get from binance api
 exports.get_asset_detail = (api_key, api_secret, symbol) => {

    // sha256 requrest parameters (recvWindow is not required, timestamp is required
    var ts = 'timestamp=' + Date.now()

    var tsHash = hmacSHA256(ts, api_secret).toString()

    // console.log('retrieving: ' + 'https://api.binance.com//wapi/v3/assetDetail.html?' + ts + '&signature=' + tsHash)

    var config = {
      headers: {'X-MBX-APIKEY': api_key}
    }

    return axios.get('https://api.binance.com//wapi/v3/assetDetail.html?' + ts + '&signature=' + tsHash, config)
      .then((mapping) => {

        // dbg.logDeep('mapping: ', mapping.data)
        if(mapping && mapping.data)

        // get a specific symbol if defined
        if (symbol && symbol.length > 0) {
          // const res = _.findWhere(mapping.data.asset, {'symbol': symbol.toUpperCase()})
          const res = mapping.data.assetDetail[symbol.toUpperCase()]
          return res
        }
        // else return the whole list of assets
        return mapping.data
      })
      .catch(err => {
        console.log(err.message)
        throw err
      })


 }
