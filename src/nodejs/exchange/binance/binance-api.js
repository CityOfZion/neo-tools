// binance.com api module
// TODO ORganize by MARKET_DATA / USER_DATA etc

// be sure to watch for weight response
// https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

require('module-alias/register')

const axios       = require('axios')
const _           = require('underscore')
const hmacSHA256  = require("crypto-js/hmac-sha256");

const dbg         = require('nodejs_util/debug')



var defly = false

// Run this to configure API
// debug = true | turns on verbose activity console printing

exports.debug = (debug) => {
  if (debug !== undefined) defly = debug
  else defly = !defly
  if (defly) console.log('binance api debugging enabled')
  else console.log('This is your last debugging message! binance api debugging disabled')
}


// query binance for all symobls
// weight 1

exports.get_all_symbols = () => {
  return this.get_price()
}

// query binance.com for price info
// Weight 1
// return a given coin if coin argument is present, otherwise return all coins

exports.get_price = (coin, currency) => {
  let url = 'https://api.binance.com/api/v3/ticker/price'

  if (coin) url += '?symbol=' + coin.toUpperCase()

  if (defly) console.log('retrieving: ' + url)

  return axios.get(url)
    .then((mapping) => {
      // dbg.logDeep('map: ', mapping)
      // const res = _.findWhere(mapping.data, {'symbol': coin.toUpperCase()})
      if(coin) {
        if (mapping && mapping.data && mapping.data.price) return mapping.data
        else console.log('Please provide a valid Binance symbol.')
        return null
      } else {
        if(mapping && mapping.data) return mapping.data
      }
    })
    .catch(err => {
      console.log('\nIf you are seeing 400 error, you may want to make sure you are using the right symbol. Try "get_all_symbols -a 1"\n')
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
  let url = 'https://api.binance.com/api/v3/ticker/bookTicker'

  if (defly) console.log('retrieving: ' + url)

  return axios.get(url)
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

// get asset_detail
// (USER_DATA: Requires signed endpoint security)
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

  if (defly) console.log('retrieving: ' + 'https://api.binance.com//wapi/v3/assetDetail.html?' + ts + '&signature=' + tsHash)

  let url = 'https://api.binance.com//wapi/v3/assetDetail.html?' + ts + '&signature=' + tsHash

  var config = {
    headers: {'X-MBX-APIKEY': api_key}
  }

  return axios.get(url, config)
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



// GET /api/v1/trades
// (MARKET_DATA: requires valid API key)
// weight 1
// Parameters:
//
// Name	  Type	 Mandatory	Description
// symbol	STRING	YES
// limit	INT	     NO	       Default 500; max 1000.

 exports.get_recent_trades = (api_key, symbol, limit) => {
   let url = 'https://api.binance.com//wapi/v3/assetDetail.html?' + ts + '&signature=' + tsHash

   var config = {
     headers: {'X-MBX-APIKEY': api_key}
   }

   if (defly) console.log('retrieving: ' + url)

   return axios.get(url, config)
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


 // Test connectivity
 // GET /api/v1/ping
 // Test connectivity to the Rest API.
 //
 // Weight: 1
// Parameters: NONE
//
// Response:
// {}

exports.ping = () => {
  let url = 'https://api.binance.com/api/v1/ping'

  if (defly) console.log('retrieving: ' + url)

  return axios.get(url)
    .then((mapping) => {
      return mapping.data
    })
    .catch(err => {
      console.log(err.message)
      throw err
    })
}

// Check server time
// GET /api/v1/time
// Test connectivity to the Rest API and get the current server time.
//
// Weight: 1
//
// Parameters: NONE
//
// Response:
//
// {
//   "serverTime": 1499827319559
// }
//
// It is left to the caller to convert the date!
exports.get_server_time = () => {
  let url = 'https://api.binance.com/api/v1/time'

  if (defly) console.log('retrieving: ' + url)

  return axios.get(url)
    .then((mapping) => {
      return mapping.data
    })
    .catch(err => {
      console.log(err.message)
      throw err
    })
}
