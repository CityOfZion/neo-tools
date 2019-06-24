// neoscan get_address_abstracts

require('module-alias/register')

const program   = require('commander');
const _         = require('underscore')

const dbg       = require('nodejs_util/debug')
const neoscan   = require('nodejs_neoscan/neoscan')
var jsonexport  = require('jsonexport');
var cfg         = require('nodejs_config/config.js')
var config      = cfg.load('nodejs_config/nodejs.config.json')

function print(msg) {
  console.log(msg)
}

let argus = process.argv
let pageArg = ''
let address

program
  .version('0.1.0')
  .usage('-a [address] -p [page]')
  .option('-D, --Debug', 'Debug')
  .option('-n, --net [net]', 'Select Neoscan network [net]: i.e., test_net or main_net (will use correct neoscan host and path respectively - defaults to test_net)', 'test_net')
  .option('-a, --address [address]', 'Specify the address for balance inquiry')
  .option('-p, --page [page]', 'Show last transactions for [address] starting at [page]', '0')
  .option('-e, --everything', 'Show all transactions for [address]', '0')
  .option('-c, --csv', 'Export results as csv format instead of json', '0')
  .option('-s, --summary', 'Print summary with results', '0')
  // TODO add option to convert currency scripthash to human readable
  // TODO add dump output to file option
  .parse(argus)

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.address) {
  // check for a default address in config, if not pressent show help
  var default_account = cfg.getDefaultAccount()

  if(default_account) address = default_account.address

  else program.help()
} else {
  address = program.address
}

if (program.page)  {
  pageArg = program.page
}

if (program.Debug) {
  print('DEBUGGING')
  neoscan.debug(true)
}


neoscan.set_net(program.net)

neoscan.get_address_abstracts(address, pageArg).then(result => {
  if (program.csv) {
    if (result && result.data) {
      if (program.summary) {
       program.summary = false
       print('Summary')
       print('Total Pages: ' + result.data.total_pages)
       print('Total Entries: ' + result.data.total_entries)
       print('Page Size: ' + result.data.page_size)
       print('Page Number: ' + result.data.page_number)
      }
      if (program.everything) {
        var opts = {}
        opts.includedHeaders = true

        for (var i=1; i <= result.data.total_pages; i++) {
          neoscan.get_address_abstracts(address, i).then(result => {
            jsonexport(result.data.entries, opts, (err, csv) => {
              opts.includeHeaders = false
              if(err) return print(err)
              print(csv);
            })
          })
        }
      } else { // !program.everything
        jsonexport(result.data.entries, (err, csv) => {
          if(err) return print(err)
          print(csv);
        })
      }
    }
  } else { // !program.csv
    if (program.everything) {
      for (var i=1; i <= result.data.total_pages; i++) {
        neoscan.get_address_abstracts(address, i).then(result => {
          dbg.logDeep(' ', result)
        })
      }
    } else {
      dbg.logDeep(' ', result)
    }
  }
})
