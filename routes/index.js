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
    title: 'Home', 
    message: pjson.description, 
    name: pjson.name 
})
})

router.post('/addCont', function (req, res) {
  console.log(req.body);
  DataToInsert = req.body;
    var Nombre = req.body.Nombre;
    var Apellido_Pri = req.body.Apellido_Pri;
    var Apellido_Sec = req.body.Apellido_Sec;
    var Direccion = req.body.Direccion;
    var Tributa = req.body.Tributa;
    var DateQuery = req.body.Date;
    var SQL = 'SELECT ID FROM Contribuyente WHERE Nombre = ? AND  Apellido_Pri = ? AND  Apellido_Sec = ? AND  Direccion = ? AND  Tributa = ? AND  Date = ?';
    pool.query(SQL, [Nombre, Apellido_Pri,Apellido_Sec,Direccion,Tributa,DateQuery], function(err, rows, fields) {
    console.log('las rows ' + rows);
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

router.get('/addCont', function (req, res) {
  res.send({error : 0,
           message : 'completed'})
 })

router.get('/contact', function (req, res) {
  res.render('contact', { 
    title: 'Contact', 
    message: '555-555-5555', 
    name: pjson.name 
})
})

router.get('/:id', function (req, res) {
  var i = 0;
  switch(req.params.id) {
    case 'toyota': i = 0; break;
    case 'subaru': i = 1; break;
    case 'nissan': i = 2; 
}
  
  res.render('cars', { 
    currentBrand: req.params.id.charAt(0).toUpperCase() + req.params.id.substr(1),
    title: req.params.id,
    name: pjson.name,
    model1: cars[i].models[0], 
    model2: cars[i].models[1],
    model3: cars[i].models[2]
    })
})

module.exports = router;
