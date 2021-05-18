// @TODO: YOUR CODE HERE!
// Chart Params
var svgWidth = 1000;
var svgHeight = 1000;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(function(data) {
  console.log(data);
  console.log([data]);

// Format the data
  data.forEach(function(d) {
    d.healthcare = +d.healthcare;
    d.poverty = +d.poverty;
  });

  // Create scaling functions
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

// Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

// Add y-axis to the left side of the display
    chartGroup.append("g")
        .call(leftAxis);

// Append axes titles
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("dow-text text", true)
    .text("Percentage in Poverty");

  chartGroup.append("text")
    .attr("transform", "rotate (-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percentage without Healthcare"); 

// append circles to data points
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "red")
    .attr("stroke", "black");

// append text to data points
var textGroup = chartGroup.append("text")
  .style("text-anchor", "middle")
  .selectAll("tspan")
  .data(data)
  .enter()
  .append("tspan")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+4);
    
// Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`Poverty ${(d.poverty)}%<hr>No Healthcare ${d.healthcare}
      %`);
    });

// Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

// Create "mouseover" event listener to display tooltip
  textGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })

// Create "mouseout" event listener to hide tooltip
  .on("mouseout", function(d) {
    toolTip.hide(d);
  });
});