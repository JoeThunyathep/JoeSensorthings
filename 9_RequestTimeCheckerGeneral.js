//==============Input paramerters here!!============================
var url = "";           // input test URL here
var headers = {};       //input test header here
var method = ""         // input test method here
var body = ""           // input body here (Only for SOS)
//==================================================================
var request = require('request');
function RequestTimeChecker() {
    let options = {
        url: url,
        headers: headers,
        method: method,
        time: true,
        body: body
    }
    request(options, function (error, httpResponse, body) {
        console.log('Request time in ms :', httpResponse.elapsedTime);
        console.log('Body :', body);
    })
}
RequestTimeChecker();