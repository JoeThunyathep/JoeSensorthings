// =========================== Required and fixed Input ===========================
const fs = require('fs');
var _ = require('lodash');
var request = require('request');
const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';
const SENSOR_API_FINAL_URL = '/Observations';
// =====================Set File Location==============
const fs = require('fs');
var fileN = 'Data/ebikeDataFTP/events_2017-11-21.log'; //input log file name
//=========================== Loading File ===========================
//* Load the .log file and turn into a JSON format
var obj     = (fs.readFileSync(fileN, 'utf8'));
obj         = obj.replace(/\n/g, ',');
obj         = '[' + obj + ']';
var obj2    = JSON.parse(obj);
console.log('file %s load successfully', fileN);
// uncomment to execute if file can be load [vin] of the first file
//console.log('First json vin: ', obj2[1].vin);  
//* variable for STA service
var ebike_vin;              //bike vin
var st_id;                  //IoT id of the Sensors and Things
var dataStr_id;             //IoT id of the observed properties
var startLine = 0;          // Set the starting line to process, 0 for processing all line!
var endLine = maxLine;      // Set to maxLine in case of processing all line!
var execute = true;         //Default at false to show the result in terminal first (not POST yet)
var maxLine = obj2.length;

//* Function "generateRequestfromJSON" make a POST request to the STA
//* Depended on the incoming log file
function generateRequestfromJSON(incomingLog, num) {
    ebike_vin = incomingLog.vin;
    st_id = executeSTid(ebike_vin);
    // need to check light and charging variable here because it is a boolean. 
    var checkLight = _.has(incomingLog, 'status.light');
    var checkCharging = _.has(incomingLog, 'status.charging');
    // need to check altitude variable here because it contain 4th level nested-JSON in JS.
    var checkAltitude = _.has(incomingLog, 'status.geo.altitude');
    //* execute here if this JSON is the ebike data from one of the bike in a HFT area.
    if (st_id != 0) {
        //console.log('"VIN" : ' + ebike_vin);
        //console.log('"IoT id" : ' + st_id);
        //Convert Data Time to TM_Object (ISO 8601 Time string)
        //"2017-11-21_02:01:17.379" ==> 2017-11-21T02:01:17.379+01:00
        //https://www.w3.org/TR/NOTE-datetime
        var dataTime = _.replace(incomingLog.timestamp, '_', 'T');

        // condition if(...) will check if the incoming JSON has the field of data or not
        // variable id matches the datastream ID in STA
        // variable dataStr_[Entity's name] constructs the POST request Which will sent through function postSTA(...) 
        if (incomingLog.status.fuelLevel) {
            var id = st_id;
            var dataStr_fuelLevel = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.fuelLevel,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_fuelLevel, num);
            } else {
                console.log(`DataStream Body fuelLevel: ` + JSON.stringify(dataStr_fuelLevel));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.status.batteryVoltageBike) {
            var id = st_id + (4 * 1);
            var dataStr_batteryVoltageBike = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.batteryVoltageBike,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_batteryVoltageBike, num);
            } else {
                console.log(`DataStream Body batteryVoltageBike: ` + JSON.stringify(dataStr_batteryVoltageBike));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.status.mileage) {
            id = st_id + (4 * 2);
            var dataStr_mileage = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.mileage,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_mileage, num);
            } else {
                console.log(`DataStream Body mileage: ` + JSON.stringify(dataStr_mileage));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.change.pedalForce) {
            id = st_id + (4 * 3);
            var dataStr_pedalForce = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.pedalForce,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_pedalForce, num);
            } else {
                console.log(`DataStream Body pedalForce: ` + JSON.stringify(dataStr_pedalForce));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.change.speed) {
            id = st_id + (4 * 4);
            var dataStr_speed = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.speed,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_speed, num);
            } else {
                console.log(`DataStream Body speed: ` + JSON.stringify(dataStr_speed));
                console.log('---------------------------------------------------')
            };
        }
        if (checkLight) {
            id = st_id + (4 * 5);
            var dataStr_light = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.light,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_light, num);
            } else {
                console.log(`DataStream Body light: ` + JSON.stringify(dataStr_light));
                console.log('---------------------------------------------------')
            };
        }
        if (checkCharging) {
            id = st_id + (4 * 6);
            var dataStr_charging = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.charging,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_charging, num);
            } else {
                console.log(`DataStream Body charging: ` + JSON.stringify(dataStr_charging));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 7);
            var dataStr_motorSupportMin = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.min,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportMin, num);
            } else {
                console.log(`DataStream Body motorSupportMin: ` + JSON.stringify(dataStr_motorSupportMin));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 8);
            var dataStr_motorSupportMax = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.max,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportMax, num);
            } else {
                console.log(`DataStream Body motorSupportMax: ` + JSON.stringify(dataStr_motorSupportMax));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 9);
            var dataStr_motorSupportavg = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.avg,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportavg, num);
            } else {
                console.log(`DataStream Body motorSupportavg: ` + JSON.stringify(dataStr_motorSupportavg));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 10);
            var dataStr_motorSupportfirstVal = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.firstVal,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportfirstVal, num);
            } else {
                console.log(`DataStream Body motorSupportfirstVal: ` + JSON.stringify(dataStr_motorSupportfirstVal));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 11);
            var dataStr_motorSupportfirstValTime = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.firstValTime,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportfirstValTime, num);
            } else {
                console.log(`DataStream Body motorSupportfirstValTime: ` + JSON.stringify(dataStr_motorSupportfirstValTime));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 12);
            var dataStr_motorSupportlastVal = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.lastVal,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportlastVal, num);
            } else {
                console.log(`DataStream Body motorSupportlastVal: ` + JSON.stringify(dataStr_motorSupportlastVal));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 13);
            var dataStr_motorSupportcount = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.count,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupportcount, num);
            } else {
                console.log(`DataStream Body motorSupportcount: ` + JSON.stringify(dataStr_motorSupportcount));
            };
        }
        if (incomingLog.change.motorSupport) {
            id = st_id + (4 * 14);
            var dataStr_motorSupporttimeSpan = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.change.motorSupport.timeSpan,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_motorSupporttimeSpan, num);
            } else {
                console.log(`DataStream Body motorSupporttimeSpan: ` + JSON.stringify(dataStr_motorSupporttimeSpan));
            };
        }
        if (incomingLog.uuid) {
            id = st_id + (4 * 15);
            var dataStr_uuid = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.uuid,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_uuid, num);
            } else {
                console.log(`DataStream Body uuid: ` + JSON.stringify(dataStr_uuid));
                console.log('---------------------------------------------------')
            };
        }
        if (incomingLog.status.geo) {
            var acc_id = st_id + (4 * 16);
            var lat_id = st_id + (4 * 17);
            var lon_id = st_id + (4 * 18);
            var dataStr_acc = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.geo.accuracy,
                "Datastream": { "@iot.id": acc_id }
            };
            var dataStr_lat = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.geo.latitude,
                "Datastream": { "@iot.id": lat_id }
            };
            var dataStr_lon = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.geo.longitude,
                "Datastream": { "@iot.id": lon_id }
            };
            if (execute) {
                postSTA(dataStr_acc, num);
                postSTA(dataStr_lat, num);
                postSTA(dataStr_lon, num);
            } else {
                console.log(`DataStream Body accuracy: ` + JSON.stringify(dataStr_acc));
                console.log(`DataStream Body latitude: ` + JSON.stringify(dataStr_lat));
                console.log(`DataStream Body longitude: ` + JSON.stringify(dataStr_lon));
            };
        }
        if (checkAltitude) {
            id = st_id + (4 * 19);
            var dataStr_altitude = {
                "phenomenonTime": dataTime,
                "resultTime": dataTime,
                "result": incomingLog.status.geo.altitude,
                "Datastream": { "@iot.id": id }
            };
            if (execute) {
                postSTA(dataStr_altitude, num);
            } else {
                console.log(`DataStream Body altitude: ` + JSON.stringify(dataStr_altitude));
                console.log('---------------------------------------------------')
            };
        }
        //Build the Observation Body
        //PhenomenonTime is the time instant or period of when the Observation happens

        // check some variable here
        //console.log('...' + checkAltitude);

    } else {
        /////////////////////////////////////////////
        // In case that the ebike are not from HFT//
        //////////////////////////////////////////// 
        //console.log('==============ebike not from HFT!==================');
    }
    //console.log('================================');
}

// * Function to check the ebikeVIN id here
function executeSTid(VIN) {
    if (VIN == "eBike20131126003c") { var id = 1; }
    else if (VIN == "eBike201209280029") { var id = 2; }
    else if (VIN == "eBike20131107003d") { var id = 3; }
    else if (VIN == "eBike201311270017") { var id = 4; }
    else { var id = 0; }
    return id;
}

// * Function to make POST request to the STA
function postSTA(item, i) {
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
        console.log(`Post datastream [${i}] to STA successfully!!`, body);
    })
}
function init() {
    for (let i = startLine; i < endLine /*obj2.length*/; i++) {
        setTimeout(function cb() {
            console.log('Read Object : ' + i)
            generateRequestfromJSON(obj2[i], i);
        }, 100 * (i - startLine));
    } // Set the time out dealy of 100 ms
}

init();