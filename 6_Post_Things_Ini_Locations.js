// =========================== Required and fixed Input ===========================
var jsonfile = require('jsonfile');
var request = require('request');
// const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';
const SENSOR_API_BASE_URL = 'http://localhost:8080/STA_Test_Rossani/v1.0'; 
// =========================== Input setup ===========================
//URL Path    
const SENSOR_API_FINAL_URL = '/Things';
//File Path
var file = 'Data/STA_initialData_HFT_Sensor/Location_HFT.json'; //Local input file
var i = 2; //start Thing ID
var j = 4; //stop Thing ID
// ===================================================================
function Post_Location() {
    jsonfile.readFile(file, function (err, obj) {
        PostSTA_Location(obj, i);
    })
}
function PostSTA_Location(item, i) {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL + '(' + i + ')/Locations',
        headers: headers,
        method: 'POST',
        body: JSON.stringify(item),
    }
    request(options, function (error, httpResponse, body) {
        if (error || i == j) {
            return console.log('Post data to STA :'+ i+ ' >> All Job Complete');
          }
        // Print out the response body
        console.log('Post data to STA :' + i + ' successful!', body);
        PostSTA_Location(item, i+1)
    })
}
Post_Location();
