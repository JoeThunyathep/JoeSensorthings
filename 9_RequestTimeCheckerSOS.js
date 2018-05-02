const SENSOR_API_BASE_URL = 'http://localhost:8080/52n-sos-webapp/service';
var request = require('request');
var bodysos = {"request": "GetResult",
"service": "SOS",
"version": "2.0.0",
"offering": "http://www.52north.org/test/offering/9",
"observedProperty": "http://www.52north.org/test/observableProperty/9_3"};
function TimeGetChecker() {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL,
        headers: headers,
        method: 'POST',
        body:  JSON.stringify(bodysos),
        time: true
    }
    request(options, function (error, httpResponse, body) {
        console.log('Request time in ms :', httpResponse.elapsedTime);
        console.log('Body :', body);
    })
}
TimeGetChecker();