#cryptoalert
#####Listen to a live feed of the latest Bitcoin, Litecoin, or Dogecoin prices and send an email alert if the value drops below a given point in USD
-------
###Setup
Change the example config to the main config
> `$ mv config.js.example config.js`

Update the `config.js` values to reflect your accounts
> `$ vim config.js`

###Usage
Set an alarm to send an email if bitcoin drops below $600 USD
> `$ node listen.js 600`

Set an alarm to send an email if litecoin drops below $6 USD
> `$ node listen.js -l 6`

Set an alarm to send an email if dogecoin drops below $0.0007 USD
> `$ node listen.js -d 0.0007`

###Email Result (btc)
Here's an example of the default email sent:
![rendered email](http://i.imgur.com/erNNift.png)
