// Send an alert email

require('module-alias/register')


const program = require('commander')
const _       = require('underscore')

const dbg     = require('nodejs_util/debug')
const email   = require('nodejs_alert/email')

function print(msg) {
  console.log(msg);
}

var from, to, subject, text

program
  .version('0.1.0')
  .usage('-t <to>')
  .option('-d, --debug', 'Debug')
  .option('-f, --from [from]', 'Set From: address; optional, will use config file default if not present as argument')
  .option('-t, --to <to>', 'Set To: address', 'to address')
  .option('-s, --subject [subject]', 'Subject of the email', 'subject test')
  .option('-b, --body [body]', 'Body of the email', 'body test')
  .parse(process.argv);


if (!program.to) {
  program.help()
}

if (program.debug) {
  print('DEBUGGING');
  email.debug() // toggle on debugging
}

email.init()

var message = {
  to: program.to,
  subject: program.subject,
  body: program.body
}

if (program.from) message.from = program.from

email.send(message)
