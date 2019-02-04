$(document).ready(function(){
    var tableColumnNum = 5;
    var qtyColumnNum = 3;
    var devColumnNum = 2;
    var dirColumnNum = 1;
    for (i = 1; i <= 10; i++) {
        updateTableView(i - 1, (tableColumnNum * i) - qtyColumnNum, 
            (tableColumnNum * i) - devColumnNum, (tableColumnNum * i) - dirColumnNum);
    }  
    var upTrafficLightData = $("#upTrafficLightView").text();
    console.log(upTrafficLightData);
    var downTrafficLightData = $("#downTrafficLightView").text();
    plotD3(JSON.parse(upTrafficLightData), JSON.parse(downTrafficLightData));
});


var updateTableView = function(index, qtyIndex, devIndex, divIndex) {
    var qty = $("tr td").eq(qtyIndex).text();
    var dev = $("tr td").eq(devIndex).text();
    var dir = $("tr td").eq(divIndex).text();
    if (parseFloat(qty) > qtyArray[index]) {
        if (dir == "U") {
            $("tr td").eq(qtyIndex).css("background-color", "#FA8072");
        } else if (dir == "D") {
            $("tr td").eq(qtyIndex).css("background-color", "#99E64D");
        }
    }
 
    if (parseFloat(dev) > 0) {
        $("tr td").eq(devIndex).css("background-color", "#FA8072");
    } else if (parseFloat(dev) < 0) {
        $("tr td").eq(devIndex).css("background-color", "#99E64D");
    }
}

var qtyArray = [50, 100, 200, 20, 50, 50, 100, 80, 5, 80];

var plotD3 = function(upData, downData) {
    //scaling data
    var w = 550;
    var h = 700;
    var margin = {
        top: 50,
        buttom: 12,
        left: 20,
        right: 20
    };
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.buttom;

    var upChart = d3.selectAll("#upChart");
    var downChart = d3.selectAll("#downChart");

    var upX = d3.scaleTime()
                .domain(d3.extent(upData, function(d){
                    return new Date(new Date(d.time.replace("Z", "")));
                })).range([0, width]);
                
    var downX = d3.scaleTime()
                .domain(d3.extent(downData, function(d){
                    return new Date(new Date(d.time.replace("Z", "")));
                })).range([width, 0]);

    var upY = d3.scaleBand()
                .domain(upData.map(function(entry){
                    return entry.key;
                }))
                .rangeRound([0, height])
                .padding(1); 

    var downY = d3.scaleBand()
                .domain(downData.map(function(entry){
                    return entry.key;
                }))
                .rangeRound([0, height])
                .padding(1); 

    //add axis
    var upXAxis = d3.axisBottom(upX);
    var upYAxis = d3.axisLeft(upY);
    var downXAxis = d3.axisBottom(downX);
    var downYAxis = d3.axisLeft(downY);
            
    //add gridline
    var xGridlines = d3.axisBottom(upX)
                        .tickSize(height, 0, 0)
                        .tickFormat("");

    var yGridlines = d3.axisLeft(upY)
                        .tickSize(-width, 0, 0)
                        .tickFormat("");

    plotUp.call(upChart, {
        data: upData,
        axis:{
            x: upXAxis,
            y: upYAxis
        },
        gridlines: yGridlines,
        initialize: true
    })

            
    plotDown.call(downChart, {
        data: downData,
        axis:{
            x: downXAxis,
            y: downYAxis
        },
        gridlines: yGridlines,
        initialize: true
    })

    function drawAxis(params)  {  
        if (params.initialize === true) {               
            //Draw the gridlines
            this.append("g")
                .call(xGridlines)
                .classed("gridline", true)
                .attr("transform", "translate(0,0)");
        
            this.append("g")
                .call(yGridlines)
                .classed("gridline", true)
                .attr("transform", "translate(0,0)"); 
            
            //this is x axis
            this.append("g")
                .classed("x axis", true)
                .attr("transform", "translate(0,0)")
                .call(params.axis.x)
                    .selectAll("text")
                    .classed("x-axis-label", true)
                    .style("text-anchor", "end")
                    .attr("dx", -8)
                    .attr("dy", 8)
                    .attr("transform", "translate(12,0) rotate(90)");
        } else if (params.initialize === false) {
            //update info
            this.selectAll("g.x.axis")
                .call(params.axis.x);
            
            this.selectAll(".x-axis-label")
                .style("text-anchor", "end")
                .attr("dx", -8)
                    .attr("dy", 8)
                    .attr("transform", "translate(0,0) rotate(-45)");
            
            this.selectAll("g.y.axis")
                .call(params.axis.y);
        }  
    }

    function plotUp(params) {
        //Drao the axes and axes labels
        drawAxis.call(this, params)
        this.selectAll(".point").data(params.data).enter()
            .append("circle")
            .classed("point", true)
            .attr("cx", function(d){
                return upX(new Date(d.time.replace("Z", ""))); 
            })
            .attr("cy", function(d,i){
                return upY(d.key); 
            })                      
            .attr("r", function(d){ 
                var result;
                if(+d.Qty > 8) {
                    result = 8
                } else {
                    result = +d.Qty
                }
                return result * 5; 
            })
            .style("fill", function(d){
                var result;
                if(+d.Qty > 8) {
                    result = "#8C0044"
                } else {
                    result = "red"
                }
                return result;
            });
    }

    function plotDown(params) {
        //Drao the axes and axes labels
        drawAxis.call(this, params)
        this.selectAll(".point").data(params.data).enter()
            .append("circle")
            .classed("point", true)
            .attr("cx", function(d){
                return downX(new Date(d.time.replace("Z", ""))); 
            })
            .attr("cy", function(d,i){
                return downY(d.key); 
            })                      
            .attr("r", function(d){ 
                var result;
                if(+d.Qty > 8) {
                    result = 8
                } else {
                    result = +d.Qty
                }
                return result * 5; 
            })
            .style("fill", function(d){
                var result;
                if(+d.Qty > 8) {
                    result = "#008888"
                } else {
                    result = "green"
                }
                return result;
            });
    }
}