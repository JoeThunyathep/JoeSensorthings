// =========================== Required and fixed Input ===========================
var jsonfile = require('jsonfile');
var request = require('request');
// =========================== Input setup ===========================
//URL Path
const SENSOR_API_BASE_URL = 'http://localhost:8080/STA_Test_Rossani/v1.0';    
const SENSOR_API_FINAL_URL = '/Things';
//File Path
var file = 'Data/STA_initialData_HFT_Sensor/Things_n.json'; //Local input file ("_n" means the latest updated things)
// ===================================================================
var object;
function Post_Sensor() {
    jsonfile.readFile(file, function (err, obj) {
        PostSTA_Sensor(obj, 0);
    })
}
function PostSTA_Sensor(item, i) {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL,
        headers: headers,
        method: 'POST',
        body: JSON.stringify(item[i]),
    }
    request(options, function (error, httpResponse, body) {
        if (error || i == (item.length - 1)) {
            return console.log('Post data to STA :' + i + ' >> All Job Complete');
        }
        // Print out the response body
        console.log('Post data to STA :' + i + ' successful!', body);
        PostSTA_Sensor(item, i + 1)
    })
}
Post_Sensor();
