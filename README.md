<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Summary](#summary)
- [Project Version and Status](#project-version-and-status)
- [Primary Goals](#primary-goals)
- [Requirements](#requirements)
- [Operating System Support](#operating-system-support)
- [Node.js Features](#nodejs-features)
- [Todo](#todo)
- [Developer's Note](#developers-note)
- [Roadmap](#roadmap)
- [Setup](#setup)
- [neo-tools APIs](#neo-tools-apis)
- [Configuration](#configuration)
- [All-in-One Configuration File Example](#all-in-one-configuration-file-example)
- [Calling Conventions](#calling-conventions)
- [Accounts](#accounts)
- [neo-rpc](#neo-rpc)
- [neo-js](#neo-js)
- [neon-js](#neon-js)
- [Neoscan for TestNet and MainNet](#neoscan-for-testnet-and-mainnet)
- [Exchange and Market APIs](#exchange-and-market-apis)
- [crypto](#crypto)
- [Neo Status](#neo-status)
- [CLI Chaining examples](#cli-chaining-examples)
- [Shell Script Example](#shell-script-example)
- [Monitoring, Alerts and Notifications](#monitoring-alerts-and-notifications)
- [Planned Future Calling Convention](#planned-future-calling-convention)

<!-- /TOC -->

# neo-tools

## Summary

The goal is to have all Neo Smart Economy APIs or project implementation primitives as a part of a Unix-style Command Line Interface (CLI) chainable toolset.

With neo-tools in place, one has easy lookup of various operations and functions, reference implementation, clear calling syntax, and usage examples.


## Project Version and Status

Version: 0.57.0

Status: Writing alpha code (see section Features below), documenting goals, and defining standards.

Current Implementation Focus: Node.js

Next: Database, Wallet, Server, Node



## Primary Goals
This project has three major goals:

1. Provide a command line tool for each Neo Smart Economy system function primitive. In example,
each function useful for an account, a wallet, a transaction, etc should be contained in its own module with
the ability to call it directly from the command line, by itself, and retrieve a result. Each CLI invocation should enable stdio behavior so commands may be chained together to form command line scripts.

2. Provide simple and clear examples of each Neo Smart Economy system function primitive to offer reusable, standard reference implementations for each language or API. This will accelerate community understanding and implementation adoption.

3. Get up and running quickly and easily.

## Requirements

1. Source hierarchy *must* be organized by language/implementation/function in adherence with familiar and relevant project naming conventions.
  * In Progress


2. Modules *must* be composable, where applicable.
  * In Progress


3. A registry of implementations names *must* be maintained and consistent with community.
  * In Progress: As the project is alpha this still isn't frozen.


4. A standard format for argument passing and return values *must* be maintained across *all* modules. Composability between implementations is ideal to facilitate complimentary capabilities where necessary and possible.
  * In Progress


5. Each module *must* be callable from command line with the capability to read argument input from its standard input and the ability to write operation results to its standard output. Use of standard error would be ideal.
  * In Progress: Some examples have it and some don't.


6. Each module *must* provide a description including its registered parent project name, purpose, and calling convention (arguments and return value).
  * Not Started: This exists as a function of directory organization

## Operating System Support
1. Linux

## Node.js Features

Node.js is the primary implementation platform right now. We are looking for contributions for others.

See src/nodejs/ for the following:

* Default address support via accounts config in src/nodejs/nodejs.config.json


* Dynamic RPC invocation from CLI with nodejs/neo-rpc/NEO_v2.9.0/client/cli/query.js
  * Automatically select nodes
  * Get nodes by configurable sort factor
  * GetNodesByX
    * Be careful, this can produce a lot of node traffic. It first pings each node in the list generated or provided to make sure they are up and within operating parameters and then calls the respective method requested. See [neo-rpc](#neo-rpc) for examples.

* neo-js integration
  * [neo-js on GitHub](https://github.com/cityofzion/neo-js)
  * MainNet sync
  * TestNet sync
  * mongodb support


* Configuration via nodejs/src/config.js
  * get_default_account()
  * get_exchanges()
  * get_smtp()
  * get_nodes()
* Alerts (Notifications)
  * src/nodejs/email_alert.js
  * src/nodejs/monitor/new_transaction_alert_loop


* Wallet/Account support
  * address
  * default account
  * list addresses
  * get and set watch addresses
  * NEP-2 and NEP-6 coming soon!


* Neoscan API
  - [Neoscan on GitHub](https://github.com/cityofzion/neo-scan)
  - command line is functional (see neoscan calling convention below)
  - get_address_abstracts, now with JSON and CSV export option
  - get_all_nodes
  - get_balance
  - get_block
  - get_claimable
  - get_claimed
  - get_height
  - get_last_block
  - get_last_block_time
  - get_last_transactions_by_address
  - get_transaction
  - get_unclaimed


* Exchange
  * Query coinmarketcap.com tickers
  * Binance
    * Binance API module supports signed endpoint security (USER_DATA)  https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
    * Binance API module supports wAPI for Asset Detail - Check for Suspend, Withdraw, and Deposit Status from CLI! https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md
    * Rest:
      - Order Book Ticker: get_book_ticker
      - Get Server Timer: get_server_time
      - Ping: ping
      - get_recent_trades: /api/v1/trades (incomplete)
      - get_all_symbols: (get_price wrapper with no symbol spec)
      - search symbols cli with exchange/binance/cli/get_all_symbols.js
    * WAPI:
      - Asset Detail: get_asset_detail


* Crypto
  * shacli support added for SHA256 and HMAC SHA256


* neon-js
  * [neon-js on GitHub](https://github.com/cityofzion/neon-js)
  * RPC Implementation
    * neon-js/native/cli/rpc/query.js - dynamic query construction
    * neon-js/native/cli/rpc/getConnectionCount.js - Gets the current number of connections for the node
    * neon-js/native/cli/rpc/getPeers.js - Gets a list of nodes that are currently connected/disconnected/bad by this node
    * neon-js/native/cli/rpc/getRawMemPool - Gets a list of unconfirmed transactions in memory
    * neon-js/native/cli/rpc/getVersion - Gets version information of this node
    * neon-js/native/cli/rpc/validateAddress - Verify that the address is a correct NEO address
    * neon-js/native/cli/rpc/getBestBlockHash - Get the hash of the tallest block
    * neon-js/native/cli/rpc/getBlockCount - Get the number of blocks in the chain
    * neon-js/native/cli/rpc/getBlock - Get the block by number or hash or most recent
    * neon-js/native/cli/rpc/getAccountState - Get the account stat for an address
    * neon-js/native/cli/rpc/getRawTransaction - Get a transaction by hash or block


* Neo Status - Performs health checks on Neo Network - See sectoin "Neo Status" Below
  * Vitals included:
    * version
    * peers
    * connection count
    * block count
    * raw mem pool
  * Network Vitals - get the vitals for all nodes on a given net
  * Node Vitals - get the vitals for a node


* Node.js Network Utility
  * network.resolveNetworkId()
  * network.getNodesByTallest()
  * network.getNodesByLeastConnections()
  * network.getNodesByVersion()
  * network.getNodesByPing()
  * added ping detection to improve RTT


## Todo

* Automatically generate documentation from online CLI -h --help feature

## Developer's Note

I apologize if the command-line arguments and capabilities aren't consistent across all modules yet. Due to time constraints I've been adding them as needed. I leave it as an exercise to the astute contributor to implement any examples where necessary.


## Roadmap

* Create versions for each programming language that supports Neo, i.e.:
  - Python
  - C#
  - golang

* Needs error handling and feedback standardized. This is kind of in progress.
* Implement full modularity project-wide
* Add tests

## Setup

`npm install`
,
## neo-tools APIs

For now there is no official API but features are still available. neo-tools has been designed to make the modules reusable, generally with the CLI versions demonstrating use on each feature of the model.
To leverage any module for a specific language, simple enter the ```src``` folder for that language and locate the folder/folder.js file for the relevant feature. For example, to use the Node.js config module
require src/nodejs/config/config.js.

## Configuration

The following section of ```src/nodejs/config/nodejs.config.json``` can be configured to use your wallet:

```
{
  "accounts": {
    "account_name1": {
      "address": "",
      "default": false,
      "path": "/home/user/configs/sample.config.json
    },
    "account_name2": {
      "address": "",
      "default": false,
      "path": ""
    }
  },
  "exchanges": {
    "path": "/home/user/configs/sample.config.json"
  },
  "smtp": {
    "path": "/home/user/configs/sample.config.json"
  },
  "nodes": {
    "path": "/home/fet/nwd/phetter/configs/sample.config.json"
  }
}
```

## All-in-One Configuration File Example

All of the configuration can be in one file or separated into multiple files. Check out ```nodejs/src/config/sample.config.json``` for an example of a complete configuration file to get you started. You would simply set the path key of ```nodejs.config.json``` to point to the location of your copy.

The path item of each config entry points to a json config file that adheres to the following format.

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
  },
  "smtp": {
    "host": "mail.com",
    "port": 25,
    "user": "user@user.user",
    "pass": "password",
    "from": "user@user.user"
  },
  "nodes": {
    "TestNet": [
      { "url": "https://test1.cityofzion.io" },
      { "url": "https://test2.cityofzion.io" },
      { "url": "https://test3.cityofzion.io" },
      { "url": "https://test4.cityofzion.io" },
      { "url": "https://test5.cityofzion.io" }
    ],  
    "MainNet": [
      { "url": "https://seed1.cityofzion.io:443" },
      { "url": "https://seed2.cityofzion.io:443" },
      { "url": "https://seed3.cityofzion.io:443" },
      { "url": "https://seed4.cityofzion.io:443" },
      { "url": "https://seed5.cityofzion.io:443" },
      { "url": "https://seed6.cityofzion.io:443" },
      { "url": "https://seed7.cityofzion.io:443" },
      { "url": "https://seed8.cityofzion.io:443" },
      { "url": "https://seed9.cityofzion.io:443" },
      { "url": "https://seed0.cityofzion.io:443" }
    ]   
  }     
}

```

## Calling Conventions

NOTE: If you have an account configured as default: true in config.json you can omit the address argument and it will use that one.

Many examples are provided below. Anything listed in the features above most likely has a CLI frontend. If it doesn't have an execution example below, trying calling it like any of the other examples here and add ```--help``` to see online help at command line.


### Accounts

```
cd src/nodejs/account/CLI

# List account with name test
node account/cli/list.js -n test

```


#### neo-rpc
Implementation of various Neo: v2.9.0 RPC utilities, some running against neon-js.
See: [Neo: v2.9.0](http://docs.neo.org/en-us/node/cli/2.9.0/api.html) for /Neo:v2.9.0/


```
cd src/nodejs/neo-rpc/

# Get a list of nodes by tallest
# See --help for -m --method options
node neo-rpc/v2.9.0/client/cli/getNodesBy.js -m tallest


# Use the node returned from getNodesBy to query the version for that RPC node.
# This is the RECOMMENDED method (query a specific node for repetitious operations)
# See: http://docs.neo.org/en-us/node/cli/2.9.0/api.html for /Neo:v2.9.0/

node neo-rpc/v2.9.0/client/cli/query -m getversion -n 'https://test1.cityofzion.io'


```


#### neo-js
Implementation of neo-js synchronization features for local chain capabilities.

[neo-js on GitHub](https://github.com/cityofzion/neo-js)


```


```


#### neon-js
Uses neon-js 3.11.4

[neon-js on GitHub](https://github.com/cityofzion/neon-js)

Here you'll find a CLI frontend for every RPC query method implemented by neon-js. Documentation is still in progress. When in doubt, run the command with --help argument.

```
cd src/nodejs/neon-js/native/cli/rpc/

query -h


* neon-js/native/cli/rpc/getConnectionCount.js - Gets the current number of connections for the node
* neon-js/native/cli/rpc/getPeers.js - Gets a list of nodes that are currently connected/disconnected/bad by this node
* neon-js/native/cli/rpc/getRawMemPool - Gets a list of unconfirmed transactions in memory
* neon-js/native/cli/rpc/getVersion - Gets version information of this node
* neon-js/native/cli/rpc/validateAddress - Verify that the address is a correct NEO address
* neon-js/native/cli/rpc/getBestBlockHash - Get the hash of the tallest block
* neon-js/native/cli/rpc/getBlockCount - Get the number of blocks in the chain
* neon-js/native/cli/rpc/getBlock - Get the block by number or hash or most recent
* neon-js/native/cli/rpc/getAccountState - Get the account stat for an address
* neon-js/native/cli/rpc/getRawTransaction - Get a transaction by hash or block

```

### Neoscan for TestNet and MainNet

https://neoscan.io/docs/index.html#api-v1-get

[Neoscan on GitHub](https://github.com/cityofzion/neo-scan)


```
cd src/nodejs/neoscan/cli/

# Returns page 1 of transaction summary for default address from its hash, paginated
node get_address_abstracts -n main -p 1

# Get all transactions for default address on default net (test) and export to csv
node neoscan/cli/get_address_abstracts.js --everything -c

# List all nodes on Main Net
node get_all_nodes -n MainNet

# Get balance for an address on MainNet
node get_balance -n MainNet -a youraddress

# Get a block by its hash on testnet
node get_block -h hash

# Get claimable transactions for default address on testNet
node get_claimable

# Get claimed transactions for default address on testNet
node get_claimed

# Get current block height on TestNet
node get_height

# Get the latest block data from neoscan Main Net
node get_last_block -n mainnet

# Get the latest block time from neoscan Main Net
node get_last_block_time -n mainnet

# List all transactions for address on Main net
node get_last_transactions_by_address -n MainNet -a address

# Get last 3 transactions for address with human-readable date format from test net
node get_last_transactions_by_address -a address -i 3 -H

# Only return time field of last 3 transactions in human-readable format from test net
node get_last_transactions_by_address -a address -i 3 -H -t

# transaction for a  hash on MainNet
node get_transaction.js -n mainnet -h txid

# Get the unclaimed gas for address on testnet
node get_unclaimed -a address

```
### Exchange and Market APIs
https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md

https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

```
cd src/nodejs/


# List the price of neo and total net worth for 10 shares by coinmarketcap valuation.
# Note: in this version you cannot list all symbols for cmc as you can with binance
node get_worth -s neo -a 10


# list the price of neousdt and total net worth for 3 shares by binance valuation
# ticker names found at https://api.binance.com/api/v3/ticker/price
# weight 1 for binance

node get_worth -s neousdt -a 3 -x binance


# list the price of all symbols that have "NEO" in the name and multiply their value by 2

node get_worth.js -a 2 -x binance | grep NEO -A 1


# list the price of all symbols on binance times 2 units
node get_worth.js -a 2 -x binance


cd src/nodejs/exchange/binance/cli/


# list the price of all symbols on binance times 2 units
# NOTE: this is not an alias for get worth, this ONLY does binance
# weight 1
node get_all_symbols.js -a 2


# list the price of all symbols that have "NEO" in the name and multiply their value by 2
# weight 1
node get_all_symbols.js -a 2 | grep NEO -A 1


# list the best prices on the book at binance
# weight 1

node get_book -s neousdt


# list the asset details (requires API key and secret) for NEO (or all no -s NEO)
# weight 1

node get_asset_detail -s NEO


# Test connectivity and get the exchange server time. It's up to the caller to convert to something other than milliseconds

node get_server_time


# Test connectivity of the server

node ping
```

NOTE: Be careful with binance requests, DO NOT HAMMER, the weights can add up. If you get a 429 you should stop for a while.
If you get a 418 you've been banned.



### crypto
```
cd src/nodejs/

# Create SHA256 hash of message 'test'

node shacli.js --message 'test'
```


### Neo Status
```
cd src/nodejs/

# Generate a report of vitals for mainnet and testnet
node neostatus/network_health.js -n mainnet --summary > network_health_mainnet.txt
node neostatus/network_health.js -n testnet --summary > network_health_testnet.txt

```


### CLI Chaining examples
Only those listed below are currently chainable with stdin.

```
cd src/nodejs/


# List all balances for all accounts
# -r / --readstdin indicates to read stdin as json
node account/cli/list.js | node neoscan/cli/get_balance.js -r


```

### Shell Script Example
The following shell script will loop a number of cli modules to monitor.

```
#!/bin/bash

loc="/home/fet/nwd/phetter/neotools/src/nodejs/"

while true;
  do
    node ${loc}neoscan/cli/get_balance.js -a insert_address -n mainnet;
    node ${loc}neoscan/cli/get_balance.js -n mainnet -a insert_address;
    node ${loc}neoscan/cli/get_balance.js -n mainnet -a insert_address;
    node ${loc}neoscan/cli/get_last_block_time.js -n mainnet;
    node ${loc}exchange/binance/cli/get_asset_detail.js -s neo;

    echo -e "\n";
    node ${loc}get_worth.js -s neo -a 1 -d -x binance;
    echo -e "";
    node ${loc}get_worth.js -s gas -a 1;
    echo -e "\n";
    node ${loc}get_worth.js -s bitcoin -a 1;
    echo -e "\n";
    node ${loc}get_worth.js -s cardano -a 1;
    echo -e "\n";
    node ${loc}get_worth.js -a 1 -s bobs-repair;
    echo -e "\n";

    sleep 500;
  done

```

### Monitoring, Alerts and Notifications


```
cd src/nodejs/

# Send an email
node email_alert -t you@youradddress.com -f me@myaddress.com -s "subject" -b "body"



cd src/nodejs/monitor/cli/

# Watch the default address on test net for new transactions and send an email
# when one is found. This must run with a loop of at least 1 if no -y --youngerThan transaction age in minutes is specified.
node new_transaction_alert_loop.js


# Watch the default wallet address on main net for new transactions younger than 7 minutes and send an email.
node new_transaction_alert_loop.js -N main -y 7

```

## Planned Future Calling Convention

```
neotools <registered API or implementation name> <relevant function> <function arguments>
```

Example:

```
neotools neonjs getScriptHashFromAddress AddZkjqPoPyhDhWoA8f9CXQeHQRDr8HbPo




```
