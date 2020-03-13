var fs = require('fs');
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

    const fastcsv = require('fast-csv');
    const fs = require('fs');
    const ws = fs.createWriteStream("SYMPTOM_MOCK_DATA.csv");
    fastcsv
      .write(csv, { headers: true })
        .pipe(ws);

    fs.stat('SYMPTOM_MOCK_DATA.csv', function (err, stat) {
        if (err == null) {
            console.log('File exists');

            //write the actual data and end with newline
            var csv = json2csv(toCsv) + newLine;

            fs.appendFile('SYMPTOM_MOCK_DATA.csv', csv, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        }
        
    });


    request.on("row", columns => {
        columns.forEach(column => {
           // console.log("%s\t%s", column.metadata.colName, column.value);
           // console.log(`${JSONrequest}`);
        });
    });

    connection.execSql(request);
}// JavaScript source code
