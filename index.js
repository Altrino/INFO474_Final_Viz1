// append svg to body
let svg = d3.select('body').append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .attr('id', 'svg')

// make x scaling function and append x-axis
let xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([50, 450])

let xAxis = d3.axisBottom(xScale)

svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,450)')
    .call(xAxis)

// set the parameters for the histogram
var histogram = d3.histogram()
    .value(function(d) { return d.symptom; })
    .domain(xScale.domain())
    //.thresholds(x.ticks(d3.timeMonth));

/******************************************
 * HISTOGRAM SECTION
 ******************************************/
d3.csv("SYMPTOM_MOCK_DATA.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.severity = +d.severity;
    });

    // group the data for the bars
    var bins = histogram(data);

    // Scale the range of the data in the y domain
    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); });

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(yScale));
        
});
