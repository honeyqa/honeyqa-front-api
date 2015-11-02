var express = require('express');
var config = require('./../config/config.js');
var async = require('async');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


var mysql = require('mysql');
var connection = mysql.createConnection({
	host	 : config.host,
	user 	 : config.user,
	password : config.password,
	database : config.database,
	multipleStatements : 'true'
});

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Honeyqa API Server Started: %s', port);
});

connection.connect(function(err){
	if(!err){
		console.log('Database is connected ... \n\n');
	}else{
		console.log('Error connecting database ... \n\n');
	}
});

app.get('/', function(req, res){
	res.send('Honeyqa Frontend API');
});


app.get('/user/:user_id', function(req, res){
	var key = req.params.user_id;
	var queryString = 'select email, nickname from users where id = ?';

	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});

});

app.get('/projects/:user_id', function(req, res){
	var key = req.params.user_id;
	var queryString = 'select title, apikey, platform, category, stage, time_zone, datetime ' +
		'from projects_h ' +
		'where user_id = ?';

	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result.projects = rows;

		res.send(result);
	});
});

app.get('/project/:apikey/weekly_appruncount', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select * ' +
		'from appruncount ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'order by datetime';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;


		res.header('Access-Control-Allow-Origin', '*');
	 	
	 	var result = new Object();
		var weeklyArr = [];

	 	for(var i=0; i<rows.length; i++){
	 		var element = new Object();
	 		element.error_count = rows[i].error_count;
	 		element.session_count = rows[i].session_count;
	 		element.date = rows[i].date;
	 		weeklyArr.push(element);
	 	}

	 	result.weekly = weeklyArr;
		console.log(result);


		console.log(result.weekly);
		res.send(result);
	});
});

app.get('/project/:apikey/weekly_sessioncount', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select count(*) weekly_sessioncount from sessions_h where apikey = ?';

	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});
});

app.get('/project/:apikey/weekly_errorcount', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select count(*) weekly_instancecount from error_instances_h where apikey = ?';

	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});
});


app.get('/project/:apikey/weekly_instancecount', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select count(*) weekly_instancecount from error_instances_h where apikey = ?';

	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];

		res.send(result);
	});
});

app.get('/project/:apikey/most/sessionbyappver', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select appversion, count(*) as count ' +
		'from sessions_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by appversion ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		res.send(result);
	});
});

app.get('/project/:apikey/most/errorbyappver', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select appversion, count(*) as count ' +
		'from error_instances_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by appversion ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/project/:apikey/most/errorbydevice', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select device, count(*) as count ' +
		'from error_instances_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by device ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/project/:apikey/most/errorbysdkversion', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select sdkversion, count(*) as count ' +
		'from error_instances_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by sdkversion ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/project/:apikey/most/errorbycountry', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select country, count(*) as count ' +
		'from error_instances_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by country ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/project/:apikey/most/errorbyclassname', function(req, res){
	var key = req.params.apikey;
	var queryString = 'select lastactivity, count(*) as count ' +
		'from error_instances_h ' +
		'where apikey = ? and datetime >= now() - interval 1 week ' +
		'group by lastactivity ' +
		'order by count(*) desc limit 1';
	connection.query(queryString, [key], function(err, rows, fields){
		if(err) throw err;

		res.header('Access-Control-Allow-Origin', '*');

		var result = new Object();
		result = rows[0];
		
		res.send(result);
	});
});

app.get('/project/:apikey/errors', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');

	var key = req.params.apikey;
	var queryString = 'select id, rank, num_of_instances, errorname, errorclassname, linenum, status, update_date ' +
		'from errorsh ' +
		'where apikey = ? and (status = 0 or status = 1) and update_date >= now() - interval 1 week ' +
		'order by rank, num_of_instances desc';

	connection.query(queryString, [key], function (err, rows, fields) {
		if (err) throw err;

		var json = new Object();
		var errorsArr = [];

		for(var i = 0; i <rows.length; i++){
			var element = new Object();

			//waterfall로 query문 순차 처리
			async.waterfall([
				function(callback){
					element.error_id = rows[i].id;
					element.rank = rows[i].rank;
					element.num_of_instance = rows[i].num_of_instances;
					element.errorname = rows[i].errorname;
					element.errorclassname = rows[i].errorclassname;
					element.linenum = rows[i].linenum;
					element.status = rows[i].status;
					element.update_date = rows[i].update_date;
					callback(null, i, element);
				},

					//tag 정보 추가
				function(index, element, callback){
					var queryString = 'select tag from tags where iderror = ?';
					connection.query(queryString, [element.error_id], function(err, rows, fields){
						if(rows.length != 0){
							element.tags = rows;
						}
						callback(null, index, element);
					});
				}],
				function(err, index, result){
					if(err) throw err;

					errorsArr.push(result);

					//error 리스트가 끝나면 json 보냄
					if(index == (rows.length - 1))
					{
						json.errors = errorsArr;
						res.send(json);
					}
			});
		}
	});
});

app.get('/project/:apikey/filters', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');

	async.waterfall([
		function(callback){
			var queryString = 'select appversion, count(*) as count from error_instances_h where apikey = ? group by appversion order by count desc';
			var key = req.params.apikey;
			var result = new Object;

			connection.query(queryString, [key], function(err, rows, fields){
				result.filter_appversions = rows;
				callback(null, result);
			});
		},
		function(result, callback){
			var queryString = 'select device, count(*) as count from error_instances_h where apikey = ? group by device order by count desc';
			var key = req.params.apikey;

			connection.query(queryString, [key], function(err, rows, fields){
				result.filter_devices = rows;
				callback(null, result);
			});

		},
		function(result, callback){
			var queryString = 'select sdkversion, count(*) as count from error_instances_h where apikey = ? group by sdkversion order by count desc';
			var key = req.params.apikey;

			connection.query(queryString, [key], function(err, rows, fields){
				result.filter_sdkversions = rows;
				callback(null, result);
			});
		},
		function(result, callback){
			var queryString = 'select country, count(*) as count from error_instances_h where apikey = ? group by country order by count desc';
			var key = req.params.apikey;

			connection.query(queryString, [key], function(err, rows, fields){
				result.filter_countries = rows;
				callback(null, result);
			});
		}
        //
		//function(result, callback){
		//	var queryString = 'select error_classname from errors where apikey = ? group by error_classname';
		//	var key = req.params.apikey;
        //
		//	connection.query(queryString, [key], function(err, rows, fields){
		//		result.filter_classes = rows;
		//		callback(null, result);
		//	});
		//},
        //
		//function(result, callback){
		//	var queryString = 'select tag from tags where apikey = ? group by tag';
		//	var key = req.params.apikey;
        //
		//	connection.query(queryString, [key], function(err, rows, fields){
		//		result.filter_tags = rows;
		//		callback(null, result);
		//	});
		//}

	], function(err, result){
		if(err) throw err;

		res.send(result);
	});
})


// filtered errors 작업중
app.post('/project/:apikey/filtered_errors', function(req, res){
	//console.log('name: ' + req.body.name);
	//res.send('name: ' + req.body.name);

})