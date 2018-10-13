# neo-tools

## Summary

The goal is to have all Neo Smart Economy API or project implementation primitives as a part of a unix-style command line chainable toolset.

With neotools in place, one would have easy lookup of various operations and functions, reference implementation, clear calling syntax, and usage examples. A common problem for me, working in c#, nodejs, and python, is that I'm always having to go back to one of those projects, navigate their specific layout, then locate a piece or example to be sure I'm doing something right. Instead of trying to get everyone to agree on a standard I thought why not implement a bunch of those projects' primitives in a standard way to unify that reference. Besides, being able to call a lot of those directly from command line would be really useful.


## Project Version and Status

Version: 0.47.0

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

## Node.js Features

Node.js is the main implementation platform right now. We are looking for contributions for others. See src/nodejs/, for the following:

* Default address support via accounts config in src/nodejs/nodejs.config.json
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
* Neoscan API command line is functional (see neoscan calling convention below)
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
* Neon-js RPC Implementation
  * neon-js/cli/rpc/query.js - dynamic query construction
  * neon-js/cli/rpc/getConnectionCount.js - Gets the current number of connections for the node
  * neon-js/cli/rpc/getPeers.js - Gets a list of nodes that are currently connected/disconnected/bad by this node
  * neon-js/cli/rpc/getRawMemPool - Gets a list of unconfirmed transactions in memory
  * neon-js/cli/rpc/getVersion - Gets version information of this node
  * neon-js/cli/rpc/validateAddress - Verify that the address is a correct NEO address
  * neon-js/cli/rpc/getBestBlockHash - Get the hash of the tallest block
  * neon-js/cli/rpc/getBlockCount - Get the number of blocks in the chain
  * neon-js/cli/rpc/getBlock - Get the block by number or hash or most recent
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
  * network.getNodesByTallet()
  * network.getNodesByLeastConnections()
  * network.getNodesByVersion()


## Developer's Note

I apologize if the command-line arguments and capabilities aren't consistent across all modules yet. Due to time constraints I've been adding them as needed. I leave it as an exercise to the astute contributor to implement any examples where necessary.


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
To leverage any module for a specific language, simple enter the src folder for that language and locate the folder/folder.js file for the relevant feature. For example, to use the Node.js config module
require src/nodejs/config/config.js.

## Configuration

The following section of src/nodejs/config/nodejs.config.json can be configured to use your wallet:

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

## All-In-One Configuration File Example

All of the configuration can be in one file or separated into multiple files. Check out nodejs/src/config/sample.config.json for an example of a complete configuration file to get you started. You would simply set the path key of nodejs.config.json to point to the location of your copy.

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
      { "url": "https://seed1.neo.org:20331" },
      { "url": "http://seed2.neo.org:20332" },
      { "url": "http://seed3.neo.org:20332" },
      { "url": "http://seed4.neo.org:20332" },
      { "url": "https://test1.cityofzion.io" },
      { "url": "https://test2.cityofzion.io" },
      { "url": "https://test3.cityofzion.io" },
      { "url": "https://test4.cityofzion.io" },
      { "url": "https://test5.cityofzion.io" },
      { "url": "http://seed5.neo.org:20332" }
    ],  
    "MainNet": [
      { "url": "https://seed1.switcheo.network:10331" },
      { "url": "https://seed3.switcheo.network:10331" },
      { "url": "http://seed1.travala.com:10332" },
      { "url": "https://seed1.neo.org:10331" },
      { "url": "https://seed1.cityofzion.io:443" },
      { "url": "https://seed2.cityofzion.io:443" },
      { "url": "https://seed3.cityofzion.io:443" },
      { "url": "https://seed4.cityofzion.io:443" },
      { "url": "https://seed5.cityofzion.io:443" },
      { "url": "https://seed1.redpulse.com:443" },
      { "url": "https://seed2.redpulse.com:443" },
      { "url": "https://seed.o3node.org:10331" },
      { "url": "http://seed1.aphelion-neo.com:10332" },
      { "url": "http://seed2.aphelion-neo.com:10332" },
      { "url": "http://seed4.aphelion-neo.com:10332" },
      { "url": "https://seed1.spotcoin.com:10332" },
      { "url": "http://rustylogic.ddns.net:10332" },
      { "url": "http://seed1.ngd.network:10332" },
      { "url": "http://seed2.ngd.network:10332" },
      { "url": "http://seed3.ngd.network:10332" },
      { "url": "http://seed4.ngd.network:10332" },
      { "url": "http://seed5.ngd.network:10332" },
      { "url": "http://seed6.ngd.network:10332" },
      { "url": "http://seed7.ngd.network:10332" },
      { "url": "http://seed8.ngd.network:10332" },
      { "url": "http://seed9.ngd.network:10332" }
    ]   
  }     
}

```

## Calling Conventions

NOTE: If you have an account configured as default: true in config.json you can omit the address argument and it will use that one.


### Accounts

```
cd src/nodejs/account/CLI

# List account with name test
node account/cli/list.js -n test

```


### Neoscan for TestNet and MainNet
https://neoscan.io/docs/index.html#api-v1-get

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
# when one is found. This will loop forever, return the time field, and present
# the time in human-readable format.
node new_transaction_alert_loop.js -i 0 -H -t -w 1

```

## Planned Future Calling Convention

```
neotools <registered API or implementation name> <relevant function> <function arguments>
```

Example:

```
neotools neonjs getScriptHashFromAddress AddZkjqPoPyhDhWoA8f9CXQeHQRDr8HbPo




```
