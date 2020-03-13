const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
    authentication: {
        options: {
            userName: "dev", // update me
            password: "GreenParkF25!" // update me
        },
        type: "default"
    },
    server: "computingreappliedsqlserver1.database.windows.net", // update me
    options: {
        database: "CRA_Test_Production_DB", //update me
        encrypt: true
    }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
    if (err) {
        console.error(err.message);
    } else {
        queryDatabase();
    }
});

function queryDatabase() {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
        `select
sr.[idSymptom_Reported] as symtom_recorded_id, sr.[Users_idUsers] as [patient_id], 
s.[symptom] as [symptom], sr.[severity], sr.[loc_latitude], sr.[loc_longitude],  sr.[symptom_time] as [date_time],
sr.[general_feeling] 
from [dbo].[Symptom_Reported] as sr
join [dbo].[Symptoms] as s
on sr.Symptoms_idSymptoms = s.idSymptoms
`,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );


    var JSONrequest = JSON.stringify(request);

    const { Parser } = require('json2csv');

    const fields = ['idSymptom_Reported', 'Users_idUsers',
        'symptom', 'severity', 'loc_latitude', 'loc_longitude', 'date_time', 'general_feeling'];
    const opts = { fields };

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(JSONrequest);
        console.log(csv);
    } catch (err) {
        console.error(err);
    }



    request.on("row", columns => {
        columns.forEach(column => {
            // console.log("%s\t%s", column.metadata.colName, column.value);
            // console.log(`${JSONrequest}`);
        });
    });

    connection.execSql(request);
}// JavaScript source code



let data = []

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 80, left: 80}
    , width = 960 - margin.left - margin.right
    , height = 500 - margin.top - margin.bottom;


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

svg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ -40 + "," + 230 + ")rotate(-90)") 
    .text("Counts")

svg.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate(" + 430 + "," + 450 + ")")
    .text("Symptom")

    // append the div which will be the tooltip
    // append tooltipSvg to this div
var div = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('width', 500)
    .attr('height', 500)
    .style('opacity', 0)
    .style("position", "absolute")
    .style("background-color", "rgba(255, 255, 255, 0.8)")
    .style("border-radius", "5px")

let tooltipSvg = div.append('svg')
    .attr('width', 500)
    .attr('height', 500)
    .attr('id', 'tooltip')

tooltipSvg.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ 18 + "," + 240 + ")rotate(-90)") 
    .text("Counts")

tooltipSvg.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate(" + 252 + "," + 485 + ")")
    .text("Severity")
    

// make x scaling function and append x-axis
let xScale = d3.scaleLinear()
    .domain([0, 6])
    .range([50, 450])

let xAxis = d3.axisBottom(xScale)

tooltipSvg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,450)')
    .call(xAxis)


//csv
//d3.csv("SYMPTOM_MOCK_DATA.csv")
d3.csv(csv)
    .then((csvData) => data = csvData)
    .then(() => makeBarGraph())


function createHist(symptom, csv) {
    tooltipSvg.selectAll("#y-axis").remove()
    tooltipSvg.selectAll("rect").remove()
    div.style('opacity', 1)

    let filtered = csv.filter(d => d.symptom == symptom);
    let severity = []
    for (var i = 0; i < filtered.length; i++) {
        severity.push(+filtered[i].severity)
    }
    

    // set parameters for our histogram function
    let histogram = d3.histogram()
        .value(function(d) { return d }) 
        .domain([0, 6])
        .thresholds(xScale.ticks(10)) 

    // get our bins
    let bins = histogram(severity)

    let max = 0;
    for (let i = 0; i < bins.length; i++) {
        if (bins[i].length > max) {
            max = bins[i].length
        }
    }

    let yScale = d3.scaleLinear()
        .domain([max, 0])
        .range([50, 450])

    let yAxis = d3.axisLeft(yScale)

    tooltipSvg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(50,0)')
        .call(yAxis)

    // append bars of histogram
    tooltipSvg.selectAll('.rect')
        .data(bins) // use the bins data 
        .enter()
        .append('rect')
            .attr('x', function(d) { return xScale(d.x0) - 15}) 
            .attr('y', function(d) { return yScale(d.length) - 0.55})
            .attr('width', function(d) { return xScale(d.x1) - xScale(d.x0) })
            .attr('height', function(d) { return 450 - yScale(d.length) })
            .attr('fill', 'steelblue')
            .attr('stroke', 'steelblue')
}

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
    y.domain([0, d3.max(newData.counts)]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(newData.counts)
        .enter()
        .append("rect")
        .attr("fill", "#F27E25")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(newData.symptom[i]); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); })
        .on("mouseover", function(d, i) {
            createHist(newData.symptom[i], data)
        })
        .on("mousemove", function() {
            div.style("top", (event.pageY - 50) + "px")
                .style("left",(event.pageX + 10) + "px")
        })
        .on("mouseout", function(d) {
            div.style('opacity', 0)
        })

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}

