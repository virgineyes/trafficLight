module.exports = function(app) {

    //model
    var TrafficLight = require('./models/trafficLight.js');
    var FutureData = require('./models/futureData.js');
    var Price = require('./models/price.js');

    var backUpDate = function(futureData, direction, date) {
        var trafficLight = new TrafficLight();
        trafficLight.direction = direction;
        trafficLight.bstrStockNo = futureData.bstrStockNo;
        trafficLight.Bid = parseFloat(futureData.Bid);
        trafficLight.Ask = parseFloat(futureData.Ask);
        trafficLight.Close = parseFloat(futureData.Close);
        trafficLight.Qty = parseFloat(1);
        trafficLight.time = date;
        trafficLight.save(function(err, trafficLight){
        });
    }

    var padding = function(number, length) {
        for(var len = (number + "").length; len < length; len = number.length) {
            number = "0" + number;            
        }
        return number;
    }


    app.get('/eyesc/admin/backUp', function(req, res, next){
        TrafficLight.remove({}, function(err, trafficLight) {
        })
        Price.remove({}, function(err, price) {
        })

        FutureData.find({}, function(err, futureData) {
            if (!err){ 
                var currentDate = new Date();
                var date = padding(currentDate.getDate(), 2);
                var month = padding(currentDate.getMonth() + 1, 2);
                var year = currentDate.getFullYear();
                var beginDateStr = year + "-" + month + "-" + date + "T09:00:00.000Z";
                var endDateStr = year + "-" + month + "-" + date + "T13:30:00.000Z";
                for (i = 0; i < futureData.length; i++) { 
                    backUpDate(futureData[i], "D", new Date(beginDateStr));
                    backUpDate(futureData[i], "D", new Date(endDateStr));
                    backUpDate(futureData[i], "U", new Date(beginDateStr));
                    backUpDate(futureData[i], "U", new Date(endDateStr));
                    var price = new Price();
                    price.bstrStockNo = futureData[i].bstrStockNo;
                    price.Close = parseFloat(futureData[i].Close);
                    price.save(function(err, price){
                    });
                }

                res.json({
                    // futureData:origFutureData
                });
            }
        });
    })

    app.get('/lightCart', function(req, res, next){

        var lastDayDate = {};
        Price.find({}, function(err, price) {
            if (!err){ 
                for (i = 0; i < price.length; i++) {
                    lastDayDate['a' + price[i].bstrStockNo] = price[i].Close;
                }
            } else {throw err;}
        });

        TrafficLight.find({}, function(err, trafficLightData) {
            if (!err){ 
                FutureData.find({}, function(err, futureData) {
                    if (!err){ 
                        // console.log(trafficLightDat);
                        // console.log(futureData);                        
                        var futureDataView = {};
                        for (i = 0; i < futureData.length; i++) { 
                            futureDataView['a'+ futureData[i].bstrStockNo] = [
                                futureData[i].Close,
                                futureData[i].Qty,
                                parseFloat((futureData[i].Close - lastDayDate['a'+ futureData[i].bstrStockNo]).toFixed(10)),
                                futureData[i].direction                             
                            ]
                        };

                        var upTrafficLightView = [];
                        var downTrafficLightView = [];
                        for (i = 0; i < trafficLightData.length; i++) {
                            var qty = parseFloat(trafficLightData[i].Qty);
                            var qtyTarget = parseFloat(qtyArray["a" + trafficLightData[i].bstrStockNo]);
                            if (!isNaN(qtyTarget)) {
                                var level = qty/qtyTarget;
                                if (trafficLightData[i].direction == "U") {
                                    upTrafficLightView.push({
                                        key: trafficLightData[i].bstrStockNo,
                                        Qty: level,
                                        time: trafficLightData[i].time,
                                    });
                                } else if (trafficLightData[i].direction == "D") {
                                    downTrafficLightView.push({
                                        key: trafficLightData[i].bstrStockNo,
                                        Qty: level,
                                        time: trafficLightData[i].time,
                                    });
                                }
                            }
                        }

                        // console.log("view: " + JSON.stringify(trafficLightView));
                        // console.log("view: " + JSON.stringify(futureDataView));
                        var returnData = {
                            "futureDataView": futureDataView,
                            "upTrafficLightView": JSON.stringify(upTrafficLightView),
                            "downTrafficLightView": JSON.stringify(downTrafficLightView)
                        }
                     
                        res.render('lightCart.ejs', returnData);
                    } else {throw err;}
                });
            } else {throw err;}
        });
    });

    app.post('/addTrafficLightData', function(req, res){
        var trafficLight = new TrafficLight();
        trafficLight.direction = req.body.direction;
        trafficLight.bstrStockNo = req.body.bstrStockNo;
        trafficLight.Bid = parseFloat(req.body.Bid) / 100;
        trafficLight.Ask = parseFloat(req.body.Ask) / 100;
        trafficLight.Close = parseFloat(req.body.Close) / 100;
        trafficLight.Qty = parseFloat(req.body.Qty);
        trafficLight.time = req.body.time;
        trafficLight.localTime = new Date();
        trafficLight.save(function(err, trafficLight){
        });
        res.json({
            // trafficLight:trafficLight
        });
    });

    app.post('/updateFutureData', function(req, res, next){
        FutureData.findOne({
            bstrStockNo: req.body.bstrStockNo
        })
        .exec(function(err, origFutureData) {
            if (origFutureData == null) {
                var newfutureData = new FutureData();
                newfutureData.direction = req.body.direction;
                newfutureData.bstrStockNo = req.body.bstrStockNo;
                newfutureData.Close = parseFloat(req.body.Close) / 100;
                newfutureData.Qty = parseFloat(req.body.Qty);
                newfutureData.time = req.body.time;
                newfutureData.localTime = new Date();
                newfutureData.save(function(err, newfutureData){
                });
                res.json({
                    // futureData:newfutureData
                });
             } else {
                origFutureData.direction = req.body.direction;
                origFutureData.bstrStockNo = req.body.bstrStockNo;
                origFutureData.Close = parseFloat(req.body.Close) / 100;
                origFutureData.Qty = parseFloat(req.body.Qty);
                origFutureData.time = req.body.time;
                origFutureData.localTime = new Date(); 
                origFutureData.save(function(err, origFutureData){
                });
                res.json({
                    // futureData:origFutureData
                });
             }
        })
    });

    app.get('*', function(req, res){
        res.send('<h1>Page Not Found!<h1>');
    });

    // app.get('/:bstrStockNo', function(req, res, next){
    //     FutureData.find({
    //         futureData:req.prarms.bstrStockNo
    //     })
    //     .exec(function(err, product){

    //     })
    // })
};

var qtyArray = {
    a2330: 50, 
    a2317: 100, 
    a6505: 200,
    a2412: 20,
    a1301: 50,
    a1326: 50,
    a1303: 100,
    a2882: 80,
    a3008: 5,
    a2881: 80
}