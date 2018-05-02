const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';
const SENSOR_API_FINAL_URL = '/Datastreams(4)/Observations?$top=3';
var request = require('request');
function TimeGetChecker() {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL,
        headers: headers,
        method: 'GET',
        time: true
    }
    request(options, function (error, httpResponse, body) {
        console.log('Request time in ms :', httpResponse.elapsedTime);
        console.log('Body :', body);
    })
}
TimeGetChecker();