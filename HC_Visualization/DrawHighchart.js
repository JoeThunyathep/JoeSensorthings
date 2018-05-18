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
var datasize, resultJson, matrix;

var GenSerieData = function (dayFr, dayTo, month) {
    var text = ")/Observations?$orderby=resultTime&$filter=day(resultTime)%20ge%20" + dayFr + "%20and%20day(resultTime)%20le%20" + dayTo + "%20and%20month(resultTime)%20eq%20" + month + "&$select=result,resultTime"
    var FullRequestText = Base + 1 + text
    var resultJs = getJSONRequestSTA(FullRequestText);
    return resultJs;
}

// GenSeieHighestDaily not done yet
var GenSerieHighestDaily = function (dayFr, dayTo, month) {
    var text = ")/Observations?$orderby=resultTime&$filter=month(resultTime)%20eq%20" + month + "&$select=result,resultTime"
    var FullRequestText = Base + 1 + text
    var resultJs = getJSONRequestSTA(FullRequestText);
    return resultJs;
}

var getJSONRequestSTA = function (FullRequestText) {
    resultJson = [];
    matrix = [];
    $.getJSON(FullRequestText, function (data) {
        datasize = Object.size(data.value);
        for (let i = 0; i < datasize /*size of the jsonBody*/; i++) {
            var temp = [Date.parse(data.value[i].resultTime), Math.round(parseFloat(data.value[i].result) * 100) / 100];
            resultJson.push(temp); //input the resultTime in Unix
            matrix.push(temp[1]);
        }
    });
    console.log("Processing request from SensorThings API ...\n (URL : " + FullRequestText + " )");
    return [resultJson, matrix]
}




var drawChart = function (Data_Main, dateValue, monthValue, yearValue) {
    //setTimeout(function cb() {
    //var nameTag = 'E-bike ' + ebikeID;
    console.log("Drawing Graph using Highchart.js ...");
    var nameTag = '';
    Highcharts.chart('HightChartContainer', {
        chart: {
            zoomType: 'x'
        }, title: {
            text: 'Temperature (Outside), @Aula, HFT'
        },
        subtitle: {
            text: 'Date :' + dateValue +'.'+ monthValue + '.' + yearValue
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year    
                minute: '%H:%M',
                hour: '%H:%M'
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
            name: 'Data on ' + dateValue +'.'+ monthValue + '.' + yearValue,
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
