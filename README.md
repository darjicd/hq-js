# hq-js
Unofficial HQ Trivia module built for interacting with the HQ API.

```
npm i --save hq-js
```

## Getting Started & Basic Info
First of all, you will need to get your Bearer token which you would have to sniff from your device. I personally used `mitmproxy` which is my favourite for an iPhone.

To get started, you need to require the module and create a client passing your bearer token:
```js
const hqjs = require('hq-js'),
    hq = new hqjs('Bearer token goes here');
```

For a list of features with this module, please read the documentation on the wiki by clicking [here](https://github.com/proddex/hq-js/wiki)