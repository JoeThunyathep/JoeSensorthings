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
var inputGPXfile = './Data/Garmin/11_24_2017_GPX_2.csv';
var DataStreamID, outTCX, outGPX;
//* variable for STA service
var st_id;                  //IoT id of the Sensors and Things
var dataStr_id;             //IoT id of the observed properties
var execute = true;         //Default at false to show the result in terminal first (not POST yet)
var executeGPX = false;      //true false
var executeTCX = true;     //true false
var startLineGPX = 1;
//var maxLineGPX = 1129;   //all = outputGPX.length
var startLineTCX = 1;  //first line
//var maxLineTCX = 975;    //all = outputTCX.length
//* Function "generateRequestfromJSON" make a POST request to the STA
//* Depended on the incoming log file
//--------------------------------------------------------------------------------------------
function generateRequestGarminTCX(num) {
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
function generateRequestGarminGPX() {
    fs.readFile(inputGPXfile, function (err, outputGPX) {
        if (err) throw err;
        outGPX = outputGPX;
        //GPX loop
        parse(outGPX, { comment: '#' }, function (err, outputGPX) {
            for (let i = startLineGPX; i <= outputGPX.length -1 /*outputGPX.length -1*/; i++) {
                setTimeout(function cb() {
                var dataStr_Temp = {
                    "phenomenonTime": outputGPX[i][3],
                    "resultTime": outputGPX[i][3],
                    "result": outputGPX[i][4],
                    "Datastream": { "@iot.id": 84 }
                }
                var dataStr_HeartRateBpm = {
                    "phenomenonTime": outputGPX[i][3],
                    "resultTime": outputGPX[i][3],
                    "result": outputGPX[i][5],
                    "Datastream": { "@iot.id": 82 }
                }
                var dataStr_Lat = {
                    "phenomenonTime": outputGPX[i][3],
                    "resultTime": outputGPX[i][3],
                    "result": outputGPX[i][0],
                    "Datastream": { "@iot.id": 85 }
                }
                var dataStr_Long = {
                    "phenomenonTime": outputGPX[i][3],
                    "resultTime": outputGPX[i][3],
                    "result": outputGPX[i][1],
                    "Datastream": { "@iot.id": 86 }
                }
                var dataStr_alt = {
                    "phenomenonTime": outputGPX[i][3],
                    "resultTime": outputGPX[i][3],
                    "result": outputGPX[i][2],
                    "Datastream": { "@iot.id": 87 }
                }
                if (execute) {
                    postSTA(dataStr_Temp, i,'GPX-Temp');
                    postSTA(dataStr_HeartRateBpm, i,'GPX-HR');
                    postSTA(dataStr_alt, i,'GPX-alt');
                    postSTA(dataStr_Lat, i,'GPX-lat');
                    postSTA(dataStr_Long, i, 'GPX-long');
                } else {
                    console.log(`Temperature [${i}] :` + JSON.stringify(dataStr_Temp));
                    console.log('---------------------------------------------------')
                }
            }, 200 * (i - 0));
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
    if (executeGPX) {
        generateRequestGarminGPX();
    }
    if (executeTCX) {
        generateRequestGarminTCX();
    }
}
init();