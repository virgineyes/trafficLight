//d3 begin
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

//defind svg & Chart
var upSvg = d3.selectAll(".upLightChart").append("svg")
    .attr("width", w)
    .attr("height", h);

upSvg.append("g")
            .classed("display", true)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("id","upChart");

var downSvg = d3.selectAll(".downLightChart").append("svg")
    .attr("width", w)
    .attr("height", h);

downSvg.append("g")
            .classed("display", true)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("id","downChart");;
