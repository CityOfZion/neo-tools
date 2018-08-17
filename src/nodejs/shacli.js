// neoscan shacli

const dbg         = require('./debug')
const program     = require('commander');
const SHA256      = require("crypto-js/sha256");
const hmacSHA256  = require("crypto-js/hmac-sha256");

function print(msg) {
  console.log(msg);
}

var address

program
  .version('0.1.0')
  .usage('-m <message> -b [bits]')
  .option('-d, --debug', 'Debug')
  .option('-b, --bits [bits]', 'Select the SHA algorithm to use', '256')
  .option('-m, --message <message>', 'Message to hash with SHA')
  .option('-s, --secret [secret]', 'Use hmac with <secret>')
  .parse(process.argv);

if (!program.net) {
  // print('network: ' + program.net);
}

if (!program.message) {
 program.help()
}

if (program.debug) {
  print('DEBUGGING');
}

if (program.secret) {
  console.log('hmac256: ' + hmacSHA256(program.message, program.secret).toString())
} else {
  console.log('sha256: ' + SHA256(program.message).toString())
}
