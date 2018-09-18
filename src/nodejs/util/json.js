// json.js
// Helper functions for advanced json parsing

require('module-alias/register')

const _   = require('underscore')

const dbg = require('nodejs_util/debug')


// Look into nested json for an item with attrs

exports.findDeep = (items, attrs) => {
  function match(value) {
    for (var key in attrs) {
      if(!_.isUndefined(value)) {
        if (attrs[key] !== value[key]) {
          return false
        }
      }
    }

    return true
  }

  function traverse(value) {
    var result

    _.forEach(value, (val) => {
      if (match(val)) {
        result = val
        return false
      }

      if (_.isObject(val) || _.isArray(val)) {
        result = traverse(val)
      }

      if (result) {
        return false
      }
    })
    return result
  }
  return traverse(items)
}


// Convert json string without quotes to one with quotes

exports.quoteJSON = (string) => {
  string = string.replace(/ /g, '')                   // strip all spaces
                   .replace(/([\w]+)=/g, '"$1"=')      // quote keys
                   .replace(/=([\w]+)/g, ':"$1"')      // quote values
                   .replace(/=([[{])/g, ':$1');

  return string
}


// execute callback for each key where key matches pattern
// callback args: key, value

exports.findAllKeysWhere = (obj, pattern, callback) => {
  _.each(obj, (value, key) => {
    if (_.isObject(value) && !_.isFunction(value)) {
      this.findAllKeysWhere(value, pattern, callback)
    } else if (key === pattern)  {
      callback(key, value)
    }
  })
}


// crawl a json object and execute callback for every key
// callback args: key, value

exports.forEvery = (obj, callback) => {
  for (var key in obj) {
    if (_.isObject(value) && !_.isFunction(value)) {
      this.forEvery(obj[key], string + ' ' + key)
    } else {
      callback(key, value)
    }
  }
}
