var express = require('express');
//var mysql = require('./dbcon.js');



var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
    context.results = rows;
    res.render('exerciseTable', context);
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", 
  [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs ], 
  function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.render('exerciseTable',context);
  });
});

app.get('/delete',function(req,res,next){
  var context = {};
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});


app.get('/edit', function(req,res,next){
	
	var context = {};
	
	var id = req.query.id;
	var name = req.query.name;
	var reps = req.query.reps;
	var weight = req.query.weight;
	var date = req.query.date;
	var lbs = req.query.lbs;
	
	context.id = id;
	context.name = name;
	context.reps = reps;
	context.weight = weight;
	context.date = date;
	context.lbs = lbs;
	res.render('editForm', context);
	
});

///safe-update?id=1&name=The+Task&done=false
app.get('/safe-update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs,  req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});