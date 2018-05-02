    // =========================== Required and fixed Input ===========================
    var jsonfile = require('jsonfile');
    var request = require('request');
    
    // =========================== Input setup ===========================
    const SENSOR_API_FINAL_URL = '/Datastreams';
    const SENSOR_API_BASE_URL = 'http://localhost:8080/SensorThingsService/v1.0';

    // Set variable depend on the object in SensorThings Service
    var IdThings_First  = 1;  //1
    var IdThings_Last   = 4;  //4
    var IdObsProp_First = 2; //1
    var IdObsProp_Last  = 20; //20
    
    // ============================ Define Variable =========================
    var datastreamBody = []; 
    var DS_Name;    var DS_Description; var DS_obType;
    var UoM_Name;   var UoM_Symbol;     var UoM_Definition;
    var s_id;       var CoreDS_Name;    var count = 0;
    
    function Post_Sensorthings() {
        //loop through all STA services
        //* o_id --> ObservedProperties
        //* st_id --> Things and Sensors ID
        for (let o_id = IdObsProp_First; o_id <= IdObsProp_Last; o_id++) { /*Whole range 1 to 20*/
            for (let st_id = IdThings_First; st_id <= IdThings_Last; st_id++) { /*Whole range 1 to 4*/
                // match the IoT id of <Things and Sensors>
                if (o_id == 1) { 
                    CoreDS_Name     = "fuel level"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "percent",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Percentage",
                    UoM_Symbol      = "%"    
                }
                if (o_id == 2) { 
                    CoreDS_Name     = "battery voltage"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "milliVolt",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Volt",
                    UoM_Symbol      = "mV"    
                }
                if (o_id == 3) { 
                    CoreDS_Name     = "mileage"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "kilometer",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Kilometre",
                    UoM_Symbol      = "km"    
                }
                if (o_id == 4) { 
                    CoreDS_Name     = "pedal force"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0 - ~40]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0 - ~40]"    
                }
                if (o_id == 5) { 
                    CoreDS_Name     = "speed"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "kilometer per hour",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Kilometres_per_hour",
                    UoM_Symbol      = "km/h"    
                }
                if (o_id == 6) { 
                    CoreDS_Name     = "light"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_TruthObservation",
                    UoM_Name        = "true/false",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Boolean_data_type",
                    UoM_Symbol      = "true/false"    
                }
                if (o_id == 7) { 
                    CoreDS_Name     = "charging status"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_TruthObservation",
                    UoM_Name        = "true/false",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Boolean_data_type",
                    UoM_Symbol      = "true/false"    
                }
                if (o_id == 8) { 
                    CoreDS_Name     = "minimum motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0-255]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0-255]"    
                }
                
                if (o_id == 9) { 
                    CoreDS_Name     = "maximum motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0-255]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0-255]"    
                }
                if (o_id == 10) { 
                    CoreDS_Name     = "the average value of motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0-255]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0-255]"    
                }
                if (o_id == 11) { 
                    CoreDS_Name     = "the first value of motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0-255]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0-255]"    
                }
                if (o_id == 12) { 
                    CoreDS_Name     = "the starting time of motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation",
                    UoM_Name        = "timestamp",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Unix_time",
                    UoM_Symbol      = "timestamp"    
                }
                if (o_id == 13) { 
                    CoreDS_Name     = "the last value of motor support"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "Value [0-255]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[0-255]"    
                }
                if (o_id == 14) { 
                    CoreDS_Name     = "count (The number of motor support in the interval.)"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CountObservation",
                    UoM_Name        = "Value [10-30]",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Number",
                    UoM_Symbol      = "[10-30]"    
                }
                if (o_id == 15) { 
                    CoreDS_Name     = "time span (the length of the interval in which the data was collected)"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Datastream for recording ${CoreDS_Name}`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "millisecond",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Millisecond",
                    UoM_Symbol      = "ms"    
                }
                if (o_id == 16) { 
                    CoreDS_Name     = "nfcUids"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Shows which NFC card has been connected to the TCU`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation",
                    UoM_Name        = "idName",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/String_(computer_science)",
                    UoM_Symbol      = "idName"    
                }
                //Obs 17 - 20 : Geodata collection 
                if (o_id == 17) { 
                    CoreDS_Name     = "gps signal accuracy"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Shows gps signal accuracy`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "gps signal accuracy",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Global_Positioning_System#Accuracy_enhancement_and_surveying",
                    UoM_Symbol      = "unknown"    
                }
                if (o_id == 18) { 
                    CoreDS_Name     = "latitude"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Shows latitude`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "latitude",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Latitude",
                    UoM_Symbol      = "°"    
                }
                if (o_id == 19) { 
                    CoreDS_Name     = "longitude"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Shows longitude`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                    UoM_Name        = "longitude",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Longitude",
                    UoM_Symbol      = "°"    
                }
                if (o_id == 20) { 
                    CoreDS_Name     = "altitude"
                    DS_Name         = `ebike DataStream: ${CoreDS_Name}`,
                    DS_Description  = `Shows altitude`,
                    DS_obType       = "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation",
                    UoM_Name        = "meter",
                    UoM_Definition  = "https://en.wikipedia.org/wiki/Altitude",
                    UoM_Symbol      = "m"      
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
            }
        }
        postSTA(datastreamBody,0); 
    }
    function postSTA(DS_Body, i) {
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
