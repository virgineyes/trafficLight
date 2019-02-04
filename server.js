var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// 在console印出收到的request
var morgan = require('morgan');

require('./config/database');

//express 預設不會處理 json parse 的問題
var bodyParser = require('body-parser');

///middleware
// set up our express application
app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.urlencoded({
    extended:true
}));

// var apiRoutes = require('./api/api');

// app.use('./app',apiRoutes);

// //讓此目錄下的html都可以作為static file
app.use(express.static(__dirname + '/public'));

// 設定路徑
require('./app/routes')(app);

//launch==================================================
app.listen(port, function(){
    console.log('Server is running on port ' + port + '..........');
});
