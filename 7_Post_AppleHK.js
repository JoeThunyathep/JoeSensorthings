// =========================== Required and fixed Input ===========================
const fs = require('fs');
var _ = require('lodash');
var request = require('request');
const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';
const SENSOR_API_FINAL_URL = '/Observations';
// Require
var parse = require('csv-parse');
//-----------------------------------------Set up-----------------------------------------
var inputTCXfile = './Data/Garmin/11_24_2017_TCX_2.csv';
//var inputGPXfile = './Data/Garmin/11_24_2017_GPX_2.csv';
var DataStreamID, outTCX;
//* variable for STA service
var st_id;                  //IoT id of the Sensors and Things
var dataStr_id;             //IoT id of the observed properties
var execute = true;         //Default at false to show the result in terminal first (not POST yet)
var startLineGPX = 1;
//var maxLineGPX = 1129;   //all = outputGPX.length
var startLineTCX = 1;  //first line
//var maxLineTCX = 975;    //all = outputTCX.length
//* Function "generateRequestfromJSON" make a POST request to the STA
//* Depended on the incoming log file
//--------------------------------------------------------------------------------------------
function generateRequestAHK(num) {
    fs.readFile(inputTCXfile, function (err, outputTCX) {
        if (err) throw err;
        outTCX = outputTCX;
        parse(outTCX, { comment: '#' }, function (err, outputTCX) {
            //TCX loop
            for (let i = startLineTCX; i <= outputTCX.length-1/* maxLineTCX*/; i++) {
                setTimeout(function cb() {
                    // TCX (More detailed and more rows than GPX)
                    var dataStr_DistanceMeters = {
                        "phenomenonTime": outputTCX[i][0],
                        "resultTime": outputTCX[i][0],
                        "result": outputTCX[i][1],
                        "Datastream": { "@iot.id": 81 }
                    }
                    var dataStr_Speed = {
                        "phenomenonTime": outputTCX[i][0],
                        "resultTime": outputTCX[i][0],
                        "result": outputTCX[i][2],
                        "Datastream": { "@iot.id": 83 }
                    }
                    if (execute) {

                        postSTA(dataStr_DistanceMeters, i,'TCX-DM');
                        postSTA(dataStr_Speed, i,'TCX-speed');
                    } else {
                        console.log(`dataStr_DistanceMeters [${i}] :` + JSON.stringify(dataStr_DistanceMeters));
                        if (outputTCX[i][15]){
                            console.log(`dataStr_Lat [${i}] :` + JSON.stringify(dataStr_Lat));
                        }
                        if (outputTCX[i][16]){
                            console.log(`dataStr_Long [${i}] :` + JSON.stringify(dataStr_Long));
                        }
                        console.log('---------------------------------------------------lenght:')
                    }
                }, 300 * (i - 0));
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
        generateRequestAHK();
}
init();