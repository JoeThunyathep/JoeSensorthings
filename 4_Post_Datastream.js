    // =========================== Required and fixed Input ===========================
    var jsonfile = require('jsonfile');
    var request = require('request');
    
    // =========================== Input setup ===========================
    const SENSOR_API_FINAL_URL = '/Datastreams';
    const SENSOR_API_BASE_URL = 'http://localhost:8080/STA_Test_Rossani/v1.0';

    // Set variable depend on the object in SensorThings Service
    var IdObsProp_First = 1; // min 1
    var IdObsProp_Last  = 1; // max 1
    var IdThings_First  = 2;  // min 1
    var IdThings_Last   = 4;  // max 4
    // ============================ Define Variable =========================
    var datastreamBody = []; 
    var DS_Name;    var DS_Description; var DS_obType;
    var UoM_Name;   var UoM_Symbol;     var UoM_Definition;
    var s_id;       var CoreDS_Name;    var count = 0;
    
    function Post_Sensorthings() {
        //loop through all STA services
        //* o_id --> ObservedProperties
        //* st_id --> Things and Sensors ID
        for (let o_id = IdObsProp_First; o_id <= IdObsProp_Last; o_id++) { 
            for (let st_id = IdThings_First; st_id <= IdThings_Last; st_id++) {
                // match the IoT id of <Things and Sensors>
                if (o_id == 1) { 
                    CoreDS_Name     = "Temperature"
                    DS_Name         = `Test Data Rossany : ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name} from Aula`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Celcius",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Celcius",
                    UoM_Symbol      = "C"    
                }

                //* Format the datastream JSON body
                datastreamBody[count] = {
                    "name": DS_Name,
                    "description": DS_Description,
                    "observationType": DS_obType,
                    "unitOfMeasurement": {
                      "name": UoM_Name,
                      "symbol": UoM_Symbol,
                      "definition": UoM_Definition
                    },
                    // "Thing":{"@iot.id":st_id},
                    "Thing":{"@iot.id":st_id},
                    "ObservedProperty":{"@iot.id":o_id},
                    "Sensor":{"@iot.id":st_id}
                };
                  //console.log(JSON.stringify(datastreamBody));  */ command to check the datastream body
                  //console.log(`Sending POST request of DataStream [ObsPropID: ${o_id}][ThingID:${st_id}][SensorID:${s_id}] `)
                  count++;
        }}
        postSTA(datastreamBody,0); 
    }
    function postSTA(DS_Body, i) {
        //var x = 81 + i;
        let headers = {'Content-Type': 'application/json'};
        let options = {
            url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL,
            headers: headers,
            method: 'POST',
            body: JSON.stringify(DS_Body[i]),
            }
            //console.log(item);

        request(options, function (error, httpResponse, body) {
            if (error || i == (DS_Body.length-1)) {
                console.log(`Sending POST request of DataStream [${i}] successfully`);
                console.log(`>> All Job Complete`);
                return console.error(`show error >>` + error);              
            }
            // If not error
            //console.log("-------------Post datastream to STA successful!-------------", body);
            console.log(`Sending POST request of DataStream [${i}] => successfully`,body);
            //console.log(DS_Body[i]);
            postSTA(DS_Body,i+1)
            
        })
    }
Post_Sensorthings();
