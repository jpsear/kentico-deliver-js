# Kentico Deliver/Cloud JavaScript API (Unofficial) *WIP*

## Usage

```
npm i kentico-deliver-js --save
```

```js
import KenticoCloudAPI from 'kentico-deliver-js';

const api = new KenticoCloudAPI('Project-ID');

// Get all items of content type `drinks`
let items;

api
 .type('drinks')
 .run()
 .then(result => console.info(result, 👌))
 .catch(error => console.warn(error))
```

## API

`.type()



