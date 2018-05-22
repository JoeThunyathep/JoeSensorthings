// fuction to check size of the array
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//get Fuel Level Chart for 22/11/2017
var Base = "http://localhost:8080/STA_Test_Rossani/v1.0/Datastreams(";
var datasize, resultJson, matrix, resultRaw, dsThingName;

//Still not work well with different - month
var GenSerieData = function (dayFr, dayTo, monthFr, monthTo, DS) {
    var text = ")/Observations?$orderby=resultTime&$filter=day(resultTime)%20ge%20" + dayFr + "%20and%20day(resultTime)%20le%20" + dayTo + "%20and%20month(resultTime)%20ge%20" + monthFr + "%20and%20month(resultTime)%20le%20" + monthTo + "&$select=result,resultTime"
    var FullRequestText = Base + DS + text;
    var resultJs = getJSONRequestSTA(FullRequestText);
    return resultJs;
}
//Request with ISO still have a bug that the time period hh:mm:ss.ss is not working
var GenSerieDataN = function (isoFr, isoTo, DS) {
    var text = ")/Observations?$orderby=resultTime&$filter=resultTime%20ge%20" + isoFr + "%20and%20resultTime%20le%20" + isoTo + "&$select=result,resultTime"
    var FullRequestText = Base + DS + text;
    var DS_Thing_Request = Base + DS + ")/Thing";
    var resultJs = getJSONRequestSTA(FullRequestText,DS_Thing_Request);
    return resultJs;
}
var getJSONRequestSTA = function (FullRequestText,DS_Thing_Request) {
    resultJson = [];
    resultRaw = [];
    matrix = [];
    $.getJSON(FullRequestText, function (data) {
        $.getJSON(DS_Thing_Request, function (dataThing) {
            datasize = Object.size(data.value);
            for (let i = 0; i < datasize /*size of the jsonBody*/; i++) {
                var temp = [Date.parse(data.value[i].resultTime), Math.round(parseFloat(data.value[i].result) * 100) / 100];
                resultJson.push(temp); //input the resultTime in Unix
                matrix.push(temp[1]);
                resultRaw.push([data.value[i].resultTime, temp[1]]);
            }
            dsThingName = dataThing.name;
        });
    }
    );
    console.log("Processing request from SensorThings API ...\n (URL : " + FullRequestText + " )");
    return [resultJson, matrix]
}




var drawChart = function (Data_Main, isoFr, isoTo, DS) {
    //setTimeout(function cb() {
    //var nameTag = 'E-bike ' + ebikeID;
    console.log("Drawing Graph using Highchart.js ...");
    var nameTag = '';
    Highcharts.chart('HightChartContainer', {
        chart: {
            zoomType: 'x'
        }, title: {
            text: 'Chart [Datastream id: '  +DS+ ' ]'
        },
        subtitle: {
            text: 'Thing name: ' + dsThingName + '/ Date: [' + isoFr + '] - [' + isoTo + ']'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year    
                day: '%e %b',
                minute: '%H:%M',
                hour: '%e %b \ %H:%M:%S'
            },
            title: {
                text: 'Time'
            },
            labels: {
                step: 1
            }
        },
        yAxis: [{
            title: {
                text: 'Temperature'
            },
            labels: {
                format: '{value} '
            }
        }],
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.y:.2f} ' + ' at {point.x:%H:%M:%S.%L}',
            crosshairs: true,
            shared: true
            //valueSuffix: ' {series.su}'
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                    radius: 2
                },
                series: {
                    lineWidth: 1
                }
            }
        },

        series: [{
            name: 'Datastreams ID :' + DS,
            yAxis: 0,
            type: 'spline',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: Data_Main
        }
        ]


    });
    //}, 2000);
}
