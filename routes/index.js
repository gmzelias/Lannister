const express = require('express');
const router = express.Router();
var mysql      = require('mysql');
var moment = require('moment');

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
        var checkintable;
        if (rows[i].Tributa == 'Si')   checkintable='<div style= "text-align: center;"><input type="checkbox" checked style="height:19px; width:19px;"></input></div>'
        else checkintable='<div style="text-align: center;"><input type="checkbox" style="height:19px; width:19px;"></input></div>'
        var datatoinsert = [rows[i].Nombre,rows[i].Apellido_Pri,rows[i].Apellido_Sec,rows[i].Direccion,rows[i].Date,checkintable];
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
        var Fecha_CreacionATable = moment(rows[i].Fecha_Creacion, "DD/MM/YYYY").format('DD-MM-YY');   
        var datatoinsert = [nombrecont,apellidocont,Fecha_CreacionATable,rows[i].Cuantia+'$',Lugar_Recogida];
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


/*Routes to dashboard buttons */
router.get('/nuevoCont', function (req, res) {
  res.send({error : 0});
})

router.get('/nuevoTrib', function (req, res) {
  res.send({error : 0});
})

router.get('/listaTribs', function (req, res) {
  res.send({error : 0});
})

router.get('/resumenTributos', function (req, res) {
  res.send({error : 0});
})



router.post('/validatePassword', function (req, res) {
  if (  req.body.pass == process.env.CLAVE) res.send({error : 0});
  else res.send({error : 1})
})


router.post('/addTrib', function (req, res) {
  DataToInsert = req.body;
  console.log(DataToInsert);
    var Nombre = req.body.Nombre;
    var Lugar_Recogida = req.body.Lugar_Recogida;
    var Cuantia = req.body.Cuantia;
    var Fecha_Creacion = moment(req.body.Fecha_Creacion, "DD/MM/YYYY").format('L');   
    var Recaudado = req.body.Recaudado;
    var Notas = req.body.Notas;
    var FK_Contribuyente = req.body.FK_Contribuyente;
    var mydate = new Date(Fecha_Creacion);
    DataToInsert.Fecha_Creacion = mydate;
    var SQL = 'SELECT ID FROM Tributo WHERE Nombre = ? AND  Lugar_Recogida = ? AND  Cuantia = ? AND  Fecha_Creacion = ? AND  Recaudado = ? AND  FK_Contribuyente = ? AND  Notas = ? ';
    pool.query(SQL, [Nombre, Lugar_Recogida,Cuantia,Fecha_Creacion,Recaudado,FK_Contribuyente, Notas], function(err, rows, fields) {
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

router.get('/TribsEcuations', function (req, res) {
  var currentMonth = new Date().getMonth()+1;
  var currentDay = new Date().getDate();
  var TribsData ={};
  var tribsDay = 0;
  var tribMes = 0;
  var tribAno = 0;
  var tribaveano = 0;
  /*Querys are using 2018 as value, not current year */
    pool.query('SELECT SUM(CUANTIA) as TribAno FROM tributo WHERE YEAR(Fecha_Creacion) = 2018', function(err, rows, fields) {
      tribAno = rows[0].TribAno;
        pool.query(`SELECT AVG(CUANTIA) as tribMes FROM tributo WHERE Month(Fecha_Creacion) = ${currentMonth}`, function(err, rows, fields) {
          tribMes = rows[0].tribMes;
            pool.query(`SELECT SUM(CUANTIA) as tribsDay FROM tributo WHERE Day(Fecha_Creacion) = ${currentDay}`, function(err, rows, fields) {
              tribsDay = rows[0].tribsDay;
                pool.query(`SELECT    AVG(Cuantia) as tribaveano, Fecha_Creacion 
                FROM      tributo 
                WHERE     YEAR(Fecha_Creacion) = '2018' 
                GROUP BY  MONTH(Fecha_Creacion)`, function(err, rows, fields) {
                //console.log(rows);  
                tribaveano = rows;
                var dataTribs = {
                  'tribsAno':tribAno,
                  'tribsMes':tribMes,
                  'tribsDay':tribsDay,
                  'tribaveano':tribaveano,
                  'currentMonth':currentMonth
                }
                console.log(dataTribs);
                res.send({error : 0, dataTribs});
              });
                  if (err){
                    res.send({error : 1,
                      message : 'Error'});
                  }
              });
              if (err){
                res.send({error : 1,
                  message : 'Error'});
              }
          });
        if (err){
          res.send({error : 1,
            message : 'Error'});
        }
        if (err){
          res.send({error : 1,
            message : 'Error'});
        }
  });
})


module.exports = router;
