# neotools

## Summary

The goal is to have all Neo Smart Economy API or project implementation primitives as a part of a unix-style command line chainable toolset.

With neotools in place, one would have easy lookup of various operations and functions, reference implementation, clear calling syntax and usage examples. A common problem for me, working in c#, nodejs, and python, is that I'm always having to go back to one of those projects, navigate their specific layout, then locate a piece or example to be sure I'm doing something right. Instead of trying to get everyone to agree on a standard I thought why not implement a bunch of those projects' primitives in a standard way to unify that reference. Besides, being able to call a lot of those directly from command line would be really useful.


## Project Version and Status

Version: 0.33.0

Status: Writing alpha code (see section Features below), documenting goals, and defining standards

Next: Write implementation example template

## Primary Goals
This project has two major goals:

1. Provide a command line tool for each Neo Smart Economy system function primitive. In example,
each function useful for an account, a wallet, a transaction, etc should be contained in its own module with
the ability to call it directly from the command line, by itself, and retrieve a result. Each CLI invocation should
enable stdio behavior so commands may be chained together to form command line scripts.

2. Provide simple and clear examples of each Neo Smart Economy system function primitive to offer reusable, standard
reference implementations for each language or API. This will accelerate community understanding and implementation adoption.

## Requirements

1. Source hierarchy *must* be organized by language/implementation/function in adherence with familiar and relevant project naming conventions.

2. Modules *must* be composable, where applicable.

3. A registry of implementations names *must* be maintained and consistent with community.

4. A standard format for argument passing and return values *must* be maintained across *all* modules. Composability between
implementations is ideal to facilitate complimentary capabilities where necessary and possible.

5. Each module *must* be callable from command line with the capability to read argument input from its standard input and the ability to write operation results to its standard output. Use of standard error would be ideal.

6. Each module *must* provide a description including its registered parent project name, purpose, and calling convention (arguments and return value).

## Operating System Support
1. Linux

## Features

* Default address support via accounts config in src/nodejs/nodejs.config.json
* Wallet/Account support
  * address
  * default account
  * list addresses
  * get and set watch addresses
  * NEP-2 and NEP-6 coming soon!
* Neoscan API command line is functional (see neoscan calling convention below)
  - get_all_nodes
  - get_balance
  - get_block
  - get_height
  - get_last_transactions_by_address
  - get_transaction
  - get_unclaimed
* Exchange
  * Query coinmakertcap.com tickers
  * Binance
    * Binance API module supports signed endpoint security (USER_DATA)  https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
    * Binance API module supports wAPI for Asset Detail - Check for Suspend, Withdraw, and Deposit Status from CLI! https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md
    * Rest:
      - Order Book Ticker: get_book_ticker
      - Get Server Timer: get_server_time
      - Ping: ping
    * WAPI:
      - Asset Detail: get_asset_detail
* Crypto
  * shacli support added for SHA256 and HMAC SHA256
* Neo Status - Performs health checks on Neo Network - See sectoin "Neo Status" Below
  * Vitals included:
    * version
    * peers
    * connection count
    * block count
    * raw mem pool
  * Network Vitals - get the vitals for all nodes on a given net
  * Node Vitals - get the vitals for a node

## Roadmap

* Create versions for each programming language that supports Neo, i.e.:
  - Python
  - C#
  - golang

* Needs error handling and feedback
* Implement full modularity
* Add tests

## Setup

`npm install`

## neotools APIs

For now there is no official API but features are still available. neotools has been designed to make the modules reusable, generally with the CLI versions demonstrating use on each feature of the model.
To leverage any module for a specific language, simple enter the src folder for that language and locate the folder/folder.js file for the relevant feature. F.e., to use the Node.js config module
require src/nodejs/config/config.js.

## Wallet Configuration

The following section of src/nodejs/config/nodejs.config.json can be configured to use your wallet:

```
{
  "accounts": {
    "account_name1": {
      "address": "",
      "default": false,
      "path": ""
    },
    "account_name2": {
      "address": "",
      "default": false,
      "path": ""
    }
  }
}
```

The path item can be set to the pathname of a json config file that is in another location but follows the same format, i.e.,:

```
{
  "accounts": {
    "one": {
      "address": "address",
      "default": true
    },  
    "two": {
      "address": "address two",
      "default": false
    },  
    "three": {
      "address": "address three",
      "default": false
    }   
  }

```

## Exchange Configuration

See src/nodejs/config/nodejs.config.json for how to setup exchange API and secret keys.
You'll need to configure the path to point to a file with a json blob like this:
```
{
  "accounts": {
    "one": {
      "address": "",
      "default": true
    },
    "two": {
      "address": "",
      "default": false
    },
    "three": {
      "address": "",
      "default": false
    }
  },
  "exchanges": {
    "binance": {
      "apiKey": "",
      "secret": ""
    }
  }
}

```


This will likely be reorganized to have wallet/accounts configured somewhere else.

## Current Calling convention

NOTE: If you have an account configured as default: true in config.json you can omit the address argument and it will use that one.


### Neoscan for test and main
https://neoscan.io/docs/index.html#api-v1-get

```
cd src/nodejs/neoscan/cli/

// List all nodes on Main Net
node get_all_nodes -n MainNet

// Get balance for an address on MainNet
node get_balance -n MainNet -a youraddress

// Get a block by its hash on testnet
node get_block -h hash

// Get current block height on TestNet
node get_height

// List all transactions for address on Main net
node get_last_transactions_by_address -n MainNet -a address

// transaction for a  hash on MainNet
node get_transaction.js -n mainnet -h txid

// Get the unclaimed gas for address on testnet
node get_unclaimed -a address

```
### Exchange and Market APIs
https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md

https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

```
cd src/nodejs/

// list the price of neo and total net worth for 10 shares by coinmarketcap valuation

node get_worth -s neo -a 10


// list the price of neousdt and total net worth for 3 shares by binance valuation
// ticker names found at https://api.binance.com/api/v3/ticker/price
// weight 1 for binance

node get_worth -s neousdt -a 3 -x binance


cd src/nodejs/exchange/binance/cli/


// list the best prices on the book at binance
// weight 1

node get_book -s neousdt


// list the asset details (requires API key and secret) for NEO (or all no -s NEO)
// weight 1

node get_asset_detail -s NEO


// Test connectivity and get the exchange server time. It's up to the caller to convert to something other than milliseconds

node get_server_time


// Test connectivity of the server

node ping
```

NOTE: Be careful with binance requests, DO NOT HAMMER, the weights can add up. If you get a 429 you should stop for a while.
If you get a 418 you've been banned.



### crypto
```
cd src/nodejs/

// Create SHA256 hash of message 'test'

node shacli.js --message 'test'
```


### Neo Status
```
cd src/nodejs/

// Generate a report of vitals for mainnet and testnet
node neostatus/network_health.js -n mainnet --summary > network_health_mainnet.txt
node neostatus/network_health.js -n testnet --summary > network_health_testnet.txt

```


## Planned Future Calling Convention

```
neotools <registered API or implementation name>> <relevant function> <function arguments>
```

Example:

```
neotools neonjs getScriptHashFromAddress AddZkjqPoPyhDhWoA8f9CXQeHQRDr8HbPo




```
