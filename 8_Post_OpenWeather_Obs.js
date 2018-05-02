// =========================== Required and fixed Input ===========================
const fs = require('fs');
var _ = require('lodash');
var request = require('request');
const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';
const SENSOR_API_FINAL_URL = '/Observations';
// Require
//-----------------------------------------Set up-----------------------------------------
var inputfile = './Data/WeatherDataStuttgart/WeatherData201710to201712.json';

var DataStreamID, outTCX, outGPX;
//* variable for STA service
var st_id;                  //IoT id of the Sensors and Things
var dataStr_id;             //IoT id of the observed properties
var execute = true;         //Default at false to show the result in terminal first (not POST yet)

//var maxLineTCX = 975;    //all = output.length
//* Function "generateRequestfromJSON" make a POST request to the STA
//* Depended on the incoming log file
//--------------------------------------------------------------------------------------------
function generateRequestOPD(num) {
    fs.readFile(inputfile, function (err, output) {
        if (err) throw err;
        var out = JSON.parse(output);
        for (let i = 0; i <  out.length; i++) {
            setTimeout(function cb() {
                // TCX (More detailed and more rows than GPX)
                var dataStr_temp = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].main.temp,
                    "Datastream": { "@iot.id": 88 }
                }
                var dataStr_pressure = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].main.pressure,
                    "Datastream": { "@iot.id": 89 }
                }
                var dataStr_humidity = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].main.humidity,
                    "Datastream": { "@iot.id": 90 }
                }
                var dataStr_Speed = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].wind.speed,
                    "Datastream": { "@iot.id": 91 }
                }
                var dataStr_Wdeg = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].wind.deg,
                    "Datastream": { "@iot.id": 92 }
                }
                var dataStr_cloud = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": out[i].clouds.all,
                    "Datastream": { "@iot.id": 95 }
                }
                var dataStr_tempC = {
                    "phenomenonTime": (new Date(out[i].dt_iso)).toISOString(),
                    "resultTime": (new Date(out[i].dt_iso)).toISOString(),
                    "result": (out[i].main.temp) -273.15,
                    "Datastream": { "@iot.id": 96 }
                }
                if (execute) {

                    // postSTA(dataStr_temp, i, 'temp');
                    // postSTA(dataStr_pressure, i, 'pressure');
                    // postSTA(dataStr_humidity, i, 'humidity');
                    // postSTA(dataStr_Speed, i, 'WindSpeed');
                    // postSTA(dataStr_Wdeg, i, 'WindDeg');
                    postSTA(dataStr_cloud, i, 'clouds');
                    postSTA(dataStr_tempC, i, 'tempC');
                    
                } else {
                    // console.log(`temp [${i}] :` + JSON.stringify(dataStr_temp));
                    // console.log(`pressure [${i}] :` + JSON.stringify(dataStr_pressure));
                    // console.log(`humidity [${i}] :` + JSON.stringify(dataStr_humidity));
                    // console.log(`WindSpeed [${i}] :` + JSON.stringify(dataStr_Speed));
                    // console.log(`WindDeg [${i}] :` + JSON.stringify(dataStr_Wdeg));
                    // console.log(`clouds [${i}] :` + JSON.stringify(dataStr_cloud));
                    console.log(`dataStr_tempC [${i}] :` + JSON.stringify(dataStr_tempC));
                    console.log('---------------------------------------------------lenght:')
                }
            }, 100 * (i - 0));
        }
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
    generateRequestOPD();
}
init();