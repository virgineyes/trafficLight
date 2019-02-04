var mongoose = require('mongoose');
 
//#1 create schema
var Schema = mongoose.Schema;

var PriceSchema = Schema({
    bstrStockNo:{
        type:String
    },
    Close:{
        type:String
    }
});

//#2 create model
module.exports = mongoose.model('Price', PriceSchema);

