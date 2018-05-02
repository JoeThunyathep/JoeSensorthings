## tcx-js

### Purpose

A Node.js library for parsing TCX/XML files, such as from a Garmin GPS device.

Optionally provides additional calculated Trackpoint fields.

### Examples

#### Setup

Add tcx-js to your project or package.json file:
```
npm install tcx-js
```

Require tcx-js in your code:
```
tcx = require("tcx-js")
```

#### Parse a TCX file from Garmin Connect

Parsing elapsed time is typically sub-second, even for a marathon run.
The tcx-js Parser uses the 'node-expat' library, and the SAX API, for speed and performance.

Note: this library is implemented with CoffeeScript, and these examples are also in CoffeeScript.

```
parser = new tcx.Parser()
parser.parse_file("data/activity_twin_cities_marathon.tcx")
activity = parser.activity
creator  = activity.creator
author   = activity.author
trackpoints = activity.trackpoints
```

"creator" is the device that recorded the data

```
console.log(JSON.stringify(creator, null, 2)) ->
{
  "name": "Garmin Forerunner 620",
  "unit_id": "3875991210",
  "product_id": "1623",
  "version_major": "3",
  "version_minor": "0",
  "build_major": "0",
  "build_minor": "0"
}
```

"author" is what created the tcx/xml file

```
console.log(JSON.stringify(author, null, 2)) ->
{
  "name": "Garmin Connect API",
  "version_major": "14",
  "version_minor": "10",
  "build_major": "0",
  "build_minor": "0",
  "lang": "en",
  "part_number": "006-D2449-00"
}
```

"trackpoints" is an Array of the recorded data points

```
console.log(trackpoints.length) -> 2256

console.log(JSON.stringify(trackpoints[0], null, 2)) ->
{
  "time": "2014-10-05T13:07:53.000Z",
  "lat": "44.97431952506304",
  "lng": "-93.26310088858008",
  "alt_meters": "257.0",
  "dist_meters": "0.0",
  "hr_bpm": "85",
  "run_cadence": "89",
  "seq": 1
}

console.log(JSON.stringify(trackpoints[trackpoints.length - 1], null, 2)) ->
{
  "time": "2014-10-05T17:22:17.000Z",
  "lat": "44.95180849917233",
  "lng": "-93.10493202880025",
  "alt_meters": "260.0",
  "dist_meters": "42635.44921875",
  "hr_bpm": "161",
  "run_cadence": "77",
  "seq": 2256
}
```

#### Parse, with Augmented Calculated fields

tcx-js will optionally calculate and add the 'alt_feet', 'dist_miles',
'elapsed_sec', and 'elapsed_hhmmss' fields to each trackpoint if you configure
the parser as follows:

```
opts = {}
opts.alt_feet   = true
opts.dist_miles = true
opts.elapsed    = true  # this will add two fields - elapsed_sec and elapsed_hhmmss

p2 = new tcx.Parser(opts)
p2.parse_file("data/activity_twin_cities_marathon.tcx")
a2 = p2.activity
t2 = a2.trackpoints
console.log(JSON.stringify(t2[t2.length - 1], null, 2)) ->
{
  "time": "2014-10-05T17:22:17.000Z",
  "lat": "44.95180849917233",
  "lng": "-93.10493202880025",
  "alt_meters": "260.0",
  "dist_meters": "42635.44921875",
  "hr_bpm": "161",
  "run_cadence": "77",
  "seq": 2256,
  "alt_feet": 853.018372703412,
  "dist_miles": 26.492439912628996,
  "elapsed_sec": 15264,
  "elapsed_hhmmss": "04:14:24"
}
```

The version number of this library, and other constant values, can be determined at runtime.

```
Parser.VERSION         -> 0.1.2
Parser.FEET_PER_METER  -> 3.280839895013123
Parser.METERS_PER_MILE -> 1609.344
```

### Release History

* 2014-11-09   v0.1.2  Added optional calculated Trackpoint fields 'elapsed_sec' and 'elapsed_hhmmss'.
* 2014-11-09   v0.1.1  Added optional calculated Trackpoint fields 'alt_feet' and 'dist_miles'.
* 2014-11-09   v0.1.0  Initial working version.
* 2014-11-09   v0.0.1  alpha 1
