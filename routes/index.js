const express = require('express');
const router = express.Router();
const pjson = require('../package.json');
const cars = require('../carsData.json');
var mysql      = require('mysql');

var pool      =    mysql.createPool({
  connectionLimit : 100, //important
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'lannister',
  debug    :  false
});

router.get('/', function (req, res) {
  res.render('index', { 
    title: 'Home'
})
})

router.post('/addCont', function (req, res) {
  DataToInsert = req.body;
    var Nombre = req.body.Nombre;
    var Apellido_Pri = req.body.Apellido_Pri;
    var Apellido_Sec = req.body.Apellido_Sec;
    var Direccion = req.body.Direccion;
    var Tributa = req.body.Tributa;
    var DateQuery = req.body.Date;
    var SQL = 'SELECT ID FROM Contribuyente WHERE Nombre = ? AND  Apellido_Pri = ? AND  Apellido_Sec = ? AND  Direccion = ? AND  Tributa = ? AND  Date = ?';
    pool.query(SQL, [Nombre, Apellido_Pri,Apellido_Sec,Direccion,Tributa,DateQuery], function(err, rows, fields) {
    if (rows == 0){
      pool.query('INSERT INTO Contribuyente SET ?', DataToInsert, function (error, results, fields) {
        if (!error){
        console.log('Query executed.');
        res.send({error : 0,
          message : 'completed'})
        }
        else{
        console.log(error);
        res.send({error : 1,
          message : 'Error on Query'})
        }
    });
    }
    else
    {
      res.send({error : 1,
        message : 'Repeated'});
      }
  });
})

router.get('/getCont', function (req, res) {
  var data = [];
  pool.query('SELECT * FROM Contribuyente ORDER BY ID DESC', function(err, rows, fields) {
    if (rows == undefined){
      res.send({error : 2,
        message : 'Error while performing Query'});
    }
    else
    {
      for(var i = 0; i < rows.length;i++){  
        var datatoinsert = [rows[i].Nombre,rows[i].Apellido_Pri,rows[i].Apellido_Sec,rows[i].Direccion,rows[i].Date,rows[i].Tributa];
        data.push(datatoinsert);
      }
      res.send({error : 0,
        data});
      }
  });
})

router.get('/nuevoCont', function (req, res) {
  res.send({error : 0});
})

router.post('/validatePassword', function (req, res) {
  if (  req.body.pass == process.env.CLAVE) res.send({error : 0});
  else res.send({error : 1})
})


module.exports = router;
