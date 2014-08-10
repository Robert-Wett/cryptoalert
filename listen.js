var nodemailer = require('nodemailer')
  , Firebase   = require('firebase')
  , program    = require('commander')
  , moment     = require('moment')
  , config     = require('./config.js')
  , amount;

program
  .version('0.0.1')
  .option('-l, --litecoin', 'Listen to Litecoin price feed')
  .option('-d, --dogecoin', 'Listen to Dogecoin price feed');

program.on('--help', function() {
  console.log(' Examples:');
  console.log('   $node listen.js 590 &    #bitcoin');
  console.log('   $node listen.js -l 590 & #litecoin');
  console.log('   $node listen.js -d 590 & #dogecoin');
})

program.parse(process.argv);



if (program.litecoin && program.args[0]) {
  startFeed(+program.args[0], config.crypto[1]);
} else if (program.dogecoin && program.args[0]) {
  startFeed(+program.args[0], config.crypto[2]);
} else if (program.args[0]) {
  startFeed(+program.args[0], config.crypto[0]);
} else {
  console.log("Please enter in the dollar amount to listen for.")
}

function startFeed(_amount, cc) {
  var baseUrl = "https://publicdata-cryptocurrency.firebaseio.com/"
    , cryptoRef;

  cc = cc || "bitcoin";
  amount = parseFloat(_amount);

  cryptoRef = new Firebase(baseUrl + cc);

  cryptoRef.child("last").on("value", function(snap) {
    checkPrice(snap, cc);
  });
}

function checkPrice(snap, cc) {
  var currentPriceInUSD = parseFloat(snap.val());
  console.log(amount, currentPriceInUSD, (amount >= currentPriceInUSD));
  if (amount >= currentPriceInUSD)
    sendMailAlert(currentPriceInUSD, cc);
}

function sendMailAlert(price, cc) {
  var transporter
    , mailOptions
    , body;

  body = "<h1 style=\"font-size:600%;\">Free Money!!!!</h1>" +
         "<br />" +
         "<img src=\"http://i.imgur.com/eRbzbYx.gif\"></img>" +
         "<h1>" + cc + " prices are straight crazy right now </h2>" +
         "<h2>$" + price + "</h2>" +
         "<br />" +
         "<span style=\"font-style:italic;\">" +
         moment().format('MMMM Do YYYY, h:mm:ss a'); +
         "</span>"

  mailOptions = {
    from: config.mailFrom,
    to: config.mailTo,
    subject: cc + config.mailSubject,
    html: body
  };

  transporter = nodemailer.createTransport({
    service: config.service,
    auth: config.auth
  });

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
    }

    process.exit();
  });
}

