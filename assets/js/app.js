// @TODO: YOUR CODE HERE!


// Set up chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data from the data.csv file
// =================================
d3.csv("data.csv").then(function(newsData) {
     // Format the data
     newsData.forEach(function(data) {
         data.healthcare = +data.healthcare;
         data.poverty = +data.poverty;
         data.abbr =  data.abbr;
  });


//Create the scales for the chart
  // =================================
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(newsData, d => (d.poverty-1)), d3.max(newsData, d => d.poverty)+2])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(newsData, d => d.healthcare)+2])
  .range([height, 0]);

// Create axis functions
// ==============================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
// ==============================
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);

//Create Circles
// ==============================
var circlesGroup = chartGroup.selectAll("circle")
.data(newsData)
.enter()
.append("circle")
.attr("cx", d =>xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "lightblue")
.attr("opacity", "1");

//adding text element
var text = chartGroup.selectAll(".stateText")
    .data(newsData)
    .enter()
    .append("text")
    .classed ("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "8px")
    .text(d => d.abbr)
    .attr("text-anchor", "middle")
    .attr("fill", "white");

// Adding Tooltip

 // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Health care: ${d.healthcare}`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
                  

// Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
  

chartGroup.append("text")
  .attr("transform", `translate(${width / 3}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");
}).catch(function(error) {
console.log(error);
});
  
