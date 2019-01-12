const express = require('express');
const router = express.Router();
const pjson = require('../package.json');
const cars = require('../carsData.json');
var mysql      = require('mysql');

var pool      =    mysql.createPool({
  connectionLimit : 100, //important
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b2239cb703f15e',
  password : '1dbdb647',
  database : 'heroku_87917b0ed43f645',
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

router.get('/getTrib', function (req, res) {
  var data = [];
  pool.query('SELECT * FROM Tributo ORDER BY ID DESC', function(err, rows, fields) {
    if (rows == undefined){
      res.send({error : 2,
        message : 'Error while performing Query'});
    }
    else
    {
      for(var i = 0; i < rows.length;i++){  
        var str = rows[i].Nombre;
        var strlugar=rows[i].Lugar_Recogida;
        var nstrlugar=strlugar.indexOf(",Lat");
        var Lugar_Recogida = strlugar.slice(0, nstrlugar);
        var n = str.indexOf(" ");
        var nombrecont = str.slice(0, n);
        var apellidocont = str.slice(n, str.length);
        var datatoinsert = [nombrecont,apellidocont,rows[i].Fecha_Creacion,rows[i].Cuantia+'$',Lugar_Recogida];
        data.push(datatoinsert);
      }
      res.send({error : 0,
        data});
      }
  });
})




/*Query to populate select of contribuyentes on creating a tributo*/
router.get('/getContForTrib', function (req, res) {
  var data = [];
  pool.query('SELECT * FROM Contribuyente ORDER BY ID DESC', function(err, rows, fields) {
    if (rows == undefined){
      res.send({error : 2,
        message : 'Error while performing Query'});
    }
    else
    {
      for(var i = 0; i < rows.length;i++){  
        var datatoinsert = [rows[i].ID,rows[i].Nombre,rows[i].Apellido_Pri,rows[i].Apellido_Sec,rows[i].Direccion,rows[i].Date,rows[i].Tributa];
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

router.get('/nuevoTrib', function (req, res) {
  res.send({error : 0});
})

router.get('/listaTribs', function (req, res) {
  res.send({error : 0});
})


router.post('/validatePassword', function (req, res) {
  if (  req.body.pass == process.env.CLAVE) res.send({error : 0});
  else res.send({error : 1})
})


router.post('/addTrib', function (req, res) {
  DataToInsert = req.body;
    var Nombre = req.body.Nombre;
    var Lugar_Recogida = req.body.Lugar_Recogida;
    var Cuantia = req.body.Cuantia;
    var Fecha_Creacion = req.body.Fecha_Creacion;
    var Recaudado = req.body.Recaudado;
    var Notas = req.body.Notas;
    var FK_Contribuyente = req.body.FK_Contribuyente;
    var SQL = 'SELECT ID FROM Tributo WHERE Nombre = ? AND  Lugar_Recogida = ? AND  Cuantia = ? AND  Fecha_Creacion = ? AND  Recaudado = ? AND  FK_Contribuyente = ? AND  Notas = ? ';
    pool.query(SQL, [Nombre, Lugar_Recogida,Cuantia,Fecha_Creacion,Recaudado,FK_Contribuyente, Notas], function(err, rows, fields) {
      console.log(rows);
      if (rows == 0){ 
        pool.query('INSERT INTO Tributo SET ?', DataToInsert, function (error, results, fields) {
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


module.exports = router;
