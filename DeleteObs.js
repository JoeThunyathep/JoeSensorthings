    // =========================== Require setup ===========================
    var request = require('request');
    // =========================== Input setup ===========================
    const SENSOR_API_BASE_URL = 'http://localhost:8080/STA_Test_Rossani/v1.0';
    const SENSOR_API_FINAL_URL = '/Observations';
    var start = 2; //First IoT to delete
    var end = 288;//Last IoT to delete
    // ==============================deleteAll not used anymore!!=====================================
    function deleteSTA(i) {
        let headers = {'Content-Type': 'application/json'};
        let options = {
            url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL + '(' + i + ')',
            headers: headers,
            method: 'DELETE',
            }
        request(options, function (error, httpResponse, body) {
            if (error || i == (end)) {
                return console.log('Delete datastream number: '+ i+ ' >> All Job Complete');
              } else { 
            // Print out the response body
                console.log(('Delete datastream number: '+ i + ' on STA=> successfully =>> Response Body :'), body);
                deleteSTA(i+1);
            }
        })
    }
deleteSTA(start);
//deleteAll();

