process.env.CLAVE = 'loslannistersiemprepagansusdeudas';

const express = require('express');
const app = express();
const routes = require ('./routes');
var bodyParser = require('body-parser')

//process.env is an object that stores all of env vari as key value pairs
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.set('view engine', 'pug');
app.engine('pug', require('pug').__express);


app.use(express.static('controller'));
app.use(express.static('public'));
app.use(express.static('views'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", 'PUT, POST, GET, DELETE, OPTIONS');
  console.info(req.method + ' ' + req.originalUrl);
  next();
});


app.use(routes);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
})

