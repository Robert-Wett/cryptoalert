var nodemailer = require('nodemailer')
  , Firebase   = require('firebase')
  , moment     = require('moment')
  , config     = require('./config.js');


function startFeed(amount) {
  var btcRef = new Firebase("https://publicdata-cryptocurrency.firebaseio.com/bitcoin")
    , btcPrice;

  btcRef.child("last").on("value", function(snap) {
    btcPrice = parseFloat(snap.val());
    if (amount >= btcPrice)
      sendMailAlert(btcPrice);
  });
}


function sendMailAlert(price) {
  var transporter
    , mailOptions
    , body;

  body = "<h1>Free Money!!!!</h1><br />Time to buy - Bitcoin prices have " +
         "dropped to $<b>" + price + "</b>!<br />" +
         moment().format('MMMM Do YYYY, h:mm:ss a');

  mailOptions = {
    from: config.mailFrom,
    to: config.mailTo,
    subject: config.mailSubject,
    html: body
  };

  transporter = nodemailer.createTransport({
    service: config.service,
    auth: config.auth
  });

  transporter.sendMail(mailOptions, function(err, info) {
    if (err)
      console.log(err);
    else {
      process.exit();
    }
  });
}

if (!!process.argv[2]) {
  startFeed(parseFloat(process.argv[2]));
}