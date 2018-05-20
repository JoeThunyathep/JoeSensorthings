// Memo
// Joe-PC : CSV AulaBua1_2016 posted [All]
// Joe-Mac : CSV AulaBau1_2016 DS-1 AussenTemp posted [1-1000]
// Joe-Mac : CSV AulaBau1_2016 DS-2 AussenTemp posted [Not yet]

// =========================== Required and fixed Input ===========================
const fs = require('fs');
var _ = require('lodash');
var request = require('request');
const SENSOR_API_BASE_URL = 'http://localhost:8080/STA_Test_Rossani/v1.0';
const SENSOR_API_FINAL_URL = '/Observations';
// Require
var parse = require('csv-parse');
//-----------------------------------------Set up-----------------------------------------
var inputCSV = './Data/STA_Data_Rossany/AulaBua1_2016.csv'; // Put CSV file path here
var DataStreamID, outTemp;
//* variable for STA service
var st_id;                  //IoT id of the Sensors and Things
var dataStr_id;             //IoT id of the observed properties
var execute = true;         //Default at false to show the result in terminal first (not POST yet)
var startLine = 1;  //first line
var maxLineTCX = 1000;    //all = out.length

//* Function "generateRequestfromJSON" make a POST request to the STA
//* Depended on the incoming log file
//--------------------------------------------------------------------------------------------
function generateRequestCSV(num) {
    fs.readFile(inputCSV, function (err, out) {
        if (err) throw err;
        outTemp = out;
        parse(outTemp, { comment: '#' }, function (err, out) {
            //TCX loop
            for (let i = startLine; i <= maxLineTCX /* out.length-1 or maxLineTCX*/; i++) {
                setTimeout(function cb() {
                    // TCX (More detailed and more rows than GPX)
                    var dataStreamAussentemp = {
                        "phenomenonTime": out[i][1],
                        "resultTime": out[i][1],
                        "result": out[i][2],
                        "Datastream": { "@iot.id": 1 }
                    }
                    if (execute) {
                        postSTA(dataStreamAussentemp, i,'AussenTemp');
                    } else {
                        console.log(`dataStreamAussentemp [${i}] :` + JSON.stringify(dataStreamAussentemp));
                        console.log('---------------------------------------------------lenght:')
                    }
                }, 150 * (i - 0));
            }
        });
    });
}
// * Function to make POST request to the STA
function postSTA(item, i, nam) {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL,
        headers: headers,
        method: 'POST',
        body: JSON.stringify(item),
    }
    //console.log(item);
    request(options, function (error, httpResponse, body) {
        if (error) {
            return console.error(`Post data failed:`, error);
        }
        // Print out the response body
        console.log(`Post datastream [${nam}][${i}] to STA successfully!!`, body);
    })
}
function init() {
        generateRequestCSV();
}
init();