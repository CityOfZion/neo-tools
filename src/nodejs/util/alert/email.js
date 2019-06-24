// email.js
//
// Alert System

require('module-alias/register')

const nodemailer  = require('nodemailer')
var cfg           = require('nodejs_config/config')
const dbg         = require('nodejs_util/debug')

var transporter
var defaultFromAddress
var initialized = false

// Behavioral Configuration
var defly = false             // debugging flag - toggle with debug() or debug(bool)

exports.debug = (debug) => {
  if (debug !== undefined) defly = debug
  else defly = !defly
  if (defly) console.log('email api debugging enabled')
  else console.log('This is your last debugging message! email api debugging disabled')
}


// init the mail subsystem, if no config object is presentw will attempt defaults
// pass a config object with shape:
// config.smtp.host
// config.smtp.port
// config.smtp.user
// config.smtp.pass
// config.smtp.secure: false

exports.init = (config) => {
  // create reusable transporter object using the default SMTP transport

  if (config) {
    transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure, // true for 465, false for other ports
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass
        },
        tls: {rejectUnauthorized: false}
    })
    defaultFromAddress = config.smtp.from
  } else { // load up from defaults
    // default config
    var njscfg        = cfg.load('nodejs_config/nodejs.config.json')
    var smtpcfg       = cfg.getSmtp()

    transporter = nodemailer.createTransport({
        host: smtpcfg.host,
        port: smtpcfg.port,
        secure: smtpcfg.secure, // true for 465, false for other ports
        auth: {
            user: smtpcfg.user,
            pass: smtpcfg.pass
        },
        tls: {rejectUnauthorized: false}
    })
    defaultFromAddress = smtpcfg.from
  }
  initialized = true
  // console.log(ink.itag+" email: ");
}


// Send an email message
// Pass in an object continaing to, from, subject, body
// if from is not present it will default to configuration setting

exports.send = (obj) => {
  if (!initialized) this.init()

  // setup email data with unicode symbols
  var mailOptions = {
      from: obj.from ? obj.from : defaultFromAddress, // sender address
      to: obj.to, // comma separated list of receivers
      subject: obj.subject, // Subject line
      text: obj.body, // plain text body
      html: '' // html body
  }

  return new Promise((resolve, reject) => {

    if (defly) dbg.logDeep('send(obj): ', mailOptions)

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          reject(error)
        }
        if (defly) console.log('email: Message sent: %s', info.messageId)
        resolve(info.messageId)
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));\
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
  })
}
