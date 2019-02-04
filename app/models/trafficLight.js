var mongoose = require('mongoose');
 
//#1 create schema
var Schema = mongoose.Schema;

var TrafficLightschema = Schema({
    direction:{
        type:String
    },
    bstrStockNo:{
        type:String
    },
    Bid:{
        type:String
    },
    Ask:{
        type:String
    },
    Close:{
        type:String
    },
    Qty:{
        type:String
    },
    time:{
        type:Date
    },
    localTime:{
        type:Date
    }
});

//#2 create model
module.exports = mongoose.model('TrafficLight', TrafficLightschema);

