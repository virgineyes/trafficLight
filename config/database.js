var mongoose = require('mongoose');

var dbURI = "mongodb://eyesc:eyesc0929782002@ds113692.mlab.com:13692/future-db";

mongoose.connect(dbURI);

mongoose.connection.on('connected',function(){
    console.log('Mongoose connected to '+dbURI);
});

mongoose.connection.on('error',function(err){
    console.log('Mongoose connection error '+err);
});
