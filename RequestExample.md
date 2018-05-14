# Request Example
## Request for the specific time 
### Request for Specific Hour (Everyday, Time: 1:00 - 9:00 )

http://localhost:8080/STA_Test_Rossani/v1.0/Datastreams(1)/Observations?$filter=hour(phenomenonTime)%20ge%202%20and%20hour(phenomenonTime)%20le%2010


### Request for Specific Date (17 January, Time: 11:00 - 18:00) and ordered by result value 
> Only the highest value
http://localhost:8080/STA_Test_Rossani/v1.0/Datastreams(1)/Observations?$orderby=result%20desc&$top=1&$filter=day(resultTime)%20eq%2017%20and%20month(resultTime)%20eq%201%20and%20hour(resultTime)%20ge%2012%20and%20hour(resultTime)%20le%2019&$select=result,resultTime

> All values
http://localhost:8080/STA_Test_Rossani/v1.0/Datastreams(1)/Observations?$orderby=result%20desc&$filter=day(resultTime)%20eq%2017%20and%20month(resultTime)%20eq%201%20and%20hour(resultTime)%20ge%2012%20and%20hour(resultTime)%20le%2019&$select=result,resultTime

