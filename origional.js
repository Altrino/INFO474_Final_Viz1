
// get 100 random numbers between 0 and 100
let data = []

// append svg to body
// let svg = d3.select('body').append('svg')
//     .attr('width', 500)
//     .attr('height', 500)
//     .attr('id', 'svg')

// // make x scaling function and append x-axis
// let xScale = d3.scaleLinear()
//     .domain([0, 100])
//     .range([50, 450])

// let xAxis = d3.axisBottom(xScale)

// svg.append('g')
//     .attr('id', 'x-axis')
//     .attr('transform', 'translate(0,450)')
//     .call(xAxis)


// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
var y = d3.scaleLinear()
            .range([height, 0]);
        
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");


// d3.csv("SYMPTOM_MOCK_DATA.csv", function(error, csv_data) {
//     data = d3.nest()
//         .key(function(d) { return d.symptom;})
//         .rollup(function(d) { 
//             return d.size();
//         })
//         .entries(csv_data);
//     console.log(csv_data)
// });
    d3.csv("SYMPTOM_MOCK_DATA.csv")
        .then((csvData) => data = csvData)
        .then(() => makeBarGraph())


/******************************************
 * HISTOGRAM SECTION
 ******************************************/

function makeBarGraph() {

    // define count object that holds count for each city
    var countObj = {};

    // count how much each city occurs in list and store in countObj
    data.forEach(function(d) {
        var symptom = d.symptom;
        if(countObj[symptom] === undefined) {
            countObj[symptom] = 0;
        } else {
            countObj[symptom] = countObj[symptom] + 1;
        }
    });

    var newData = new Object()
    newData.symptom = Object.keys(countObj)
    newData.counts = Object.values(countObj)

    console.log(newData)

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.symptom; }));
    y.domain([0, d3.max(newData, function(d) { return +d.counts; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(newData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.symptom); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.counts); })
        .attr("height", function(d) { return height - y(d.counts); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // set parameters for our histogram function
    // let histogram = d3.histogram()
    //     // what value we want to count in our histogram
    //     .value(function(d) { return d }) 
    //     // the range of values from our data
    //     .domain([0, 100])
    //     // the number of bins (bars) we want in our histogram (roughly) 
    //     // learn more about bins here:
    //     // https://stackoverflow.com/questions/43380637/javascript-d3-histogram-thresholds-producing-wrong-number-of-bins
    //     // xScale.ticks(10) -> [0,10,20,...]
    //     .thresholds(xScale.ticks(10)) 

    //     // console.log(xScale.ticks(12))


    // // get our bins
    // let bins = histogram(data)
    // // console.log(bins)

    // // figure out our max y value
    // // below code is equivalent to:
    // // let max = d3.max(bins, function(d) { return d.length })
    // let max = 0;
    // for (let i = 0; i < bins.length; i++) {
    //     if (bins[i].length > max) {
    //         max = bins[i].length
    //     }
    // }
    // // console.log(max)

    // // make y-axis and y scaling function
    // let yScale = d3.scaleLinear()
    //     .domain([max, 0])
    //     .range([50, 450])

    // let yAxis = d3.axisLeft(yScale)

    // svg.append('g')
    //     .attr('id', 'y-axis')
    //     .attr('transform', 'translate(50,0)')
    //     .call(yAxis)

    // // append bars of histogram
    // svg.selectAll('.rect')
    //     .data(bins) // use the bins data 
    //     .enter()
    //     .append('rect')
    //         // x and y determine the upper left corner of our rectangle

    //         // d.x0 is the lower bound of one bin
    //         .attr('x', function(d) { return xScale(d.x0) }) 
    //         // d.length is the count of values in the bin
    //         .attr('y', function(d) { return yScale(d.length) })
    //         .attr('width', function(d) { return xScale(d.x1) - xScale(d.x0) })
    //         .attr('height', function(d) { return 450 - yScale(d.length) })
    //         .attr('fill', 'steelblue')
    //         .attr('stroke', 'white')
}







// // Get pre-computed histogram data
// d3.csv("SYMPTOM_MOCK_DATA.csv", function(json) {
//     var maxBin = 40;
//     var binInc = 10;

//     // transform data that is already binned into data
//     // that is better for use in D3
//     // we want to create something like this:
//     // [
//     //  { "x": 0,  "y": 30000 },
//     //  { "x": 10, "y": 80000 },
//     //  ...
//     // ]
//     // 

//     // use the name of the group to initialize the array
//     var group = json.symptom;
//     var data = [];
    
//     // we have a max bin for our histogram, must ensure
//     // that any bins > maximum bin are rolled into the 
//     // last bin that we have
//     var binCounts = {};
//     for( var j = 0; j < json[i].data.length; j++) {
//         var xValue = json[i].data[j].bin;
//         // bin cannot exceed the maximum bin
//         xValue = ( xValue > maxBin ? maxBin : xValue);
//         var yValue = json[i].data[j].count;
        
//         if(binCounts[xValue] === undefined) {
//         binCounts[xValue] = 0;
//         }
//         binCounts[xValue] += yValue;
//     }
    
//     // add the bin counts in
//     for( var bin in binCounts) {
//         data.push({"x": bin, "y": binCounts[bin]});
//     }
    
//     // add the histogram
//     createHistogram(data, maxBin, binInc, group.toUpperCase())
    
    
//   });
  
//   var createHistogram = function(data, maxBin, binInc, title) {
  
//     // A formatter for counts.
//     var formatCount = d3.format(",.0f");
//     var totalWidth = 480;
//     var totalHeight = 240;
//     var margin = {top: 40, right: 60, bottom: 50, left: 70},
//         width = totalWidth - margin.left - margin.right,
//         height = totalHeight - margin.top - margin.bottom;
    
//     var binArray = [];
//     for (var i = 0; i <= maxBin + binInc; i += binInc) {
//       binArray.push(i);
//     }
//     var binTicks = [];
//     for (var i = 0; i < maxBin + binInc; i += binInc) {
//       binTicks.push(i);
//     }
    
//     var x = d3.scale.linear()
//         .domain([0, maxBin + binInc])
//         .range([0, width]);
//     var binWidth = parseFloat(width / (binArray.length - 1)) - 1;
    
//     var y = d3.scale.linear()
//         .domain([0, d3.max(data, function(d) { return d.y; })])
//         .range([height, 0]);
    
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom")
//         .tickValues(binTicks);
        
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left");
    
//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//     var bar = svg.selectAll(".bar")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.x); })
//         .attr("width", binWidth)
//         .attr("y", function(d) { return y(d.y); })
//         .attr("height", function(d) { return height - y(d.y); })
//         .on("mouseover", function(d) {
//           var barWidth = parseFloat(d3.select(this).attr("width"));
//           var xPosition = parseFloat(d3.select(this).attr("x")) + (barWidth / 2);
//           var yPosition = parseFloat(d3.select(this).attr("y")) - 10;
          
//           svg.append("text")
//             .attr("id", "tooltip")
//             .attr("x", xPosition)
//             .attr("y", yPosition)
//             .attr("text-anchor", "middle")
//             .text(d.y);
//         })
//         .on("mouseout", function(d) {
//           d3.select('#tooltip').remove();
//         });
    
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);
        
//     svg.append("g")
//         .attr("class", "y axis")
//         //.attr("transform", "translate(0," + height + ")")
//         .call(yAxis);
        
//     // Add axis labels
//     svg.append("text")
//         .attr("class", "x label")
//         .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 15) + ")")
//         //.attr("dy", "1em")
//         .attr("text-anchor", "middle")
//         .text("Time (minutes)");
        
//     svg.append("text")
//         .attr("class", "y label")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left)
//         .attr("x", 0 - (height / 2))
//         .attr("dy", "1em")
//         .attr("text-anchor", "middle")
//         .text("Count");
        
//     // Add title to chart
//     svg.append("text")
//         .attr("class", "title")
//         .attr("transform", "translate(" + (width / 2) + " ," + (-20) + ")")
//         //.attr("dy", "1em")
//         .attr("text-anchor", "middle")
//         .text(title);  
//   };