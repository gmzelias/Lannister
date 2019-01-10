const express = require('express');
const app = express();
const routes = require ('./routes');

app.set('view engine', 'pug');

app.use(express.static('public'))

app.use(routes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

