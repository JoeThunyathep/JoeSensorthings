
/*
Copyright 2014, Christopher Joakim, JoakimSoftware LLC <christopher.joakim@gmail.com>
 */

(function() {
  var Parser, expat, fs, m26, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  expat = require('node-expat');

  fs = require('fs');

  m26 = require("m26-js");

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Parser = (function() {
    Parser.VERSION = '0.1.2';

    Parser.FEET_PER_METER = 3.280839895013123;

    Parser.METERS_PER_MILE = 1609.344;

    function Parser(opts) {
      if (opts == null) {
        opts = {};
      }
      this.parse_file = __bind(this.parse_file, this);
      this.options = opts;
      this.parser = new expat.Parser('UTF-8');
      this.root_tag = void 0;
      this.tag_stack = [];
      this.paths = [];
      this.end_reached = false;
      this.curr_tag = void 0;
      this.curr_text = '';
      this.curr_tkpt = void 0;
      this.tkpt0_time = void 0;
      this.tkpt0_date = void 0;
      this.activity = {};
      this.activity.creator = {};
      this.activity.author = {};
      this.activity.trackpoints = [];
      this.parser.on('startElement', (function(_this) {
        return function(name, attrs) {
          var n, p, v;
          if (_this.tag_stack.length === 0) {
            _this.root_tag = name;
          }
          _this.tag_stack.push(name);
          _this.curr_tag = name;
          _this.curr_text = '';
          p = _this.curr_path();
          _this.paths.push(p);
          for (n in attrs) {
            v = attrs[n];
            _this.paths.push(p + '@' + n);
          }
          switch (p) {
            case "Activities|Activity|Lap|Track|Trackpoint":
              _this.curr_tkpt = {};
              return _this.activity.trackpoints.push(_this.curr_tkpt);
          }
        };
      })(this));
      this.parser.on('endElement', (function(_this) {
        return function(name) {
          var p, x;
          p = _this.curr_path();
          switch (p) {
            case "Activities|Activity|Creator|Name":
              _this.activity.creator.name = _this.curr_text;
              break;
            case "Activities|Activity|Creator|ProductID":
              _this.activity.creator.product_id = _this.curr_text;
              break;
            case "Activities|Activity|Creator|UnitId":
              _this.activity.creator.unit_id = _this.curr_text;
              break;
            case "Activities|Activity|Creator|Version|BuildMajor":
              _this.activity.creator.build_major = _this.curr_text;
              break;
            case "Activities|Activity|Creator|Version|BuildMinor":
              _this.activity.creator.build_minor = _this.curr_text;
              break;
            case "Activities|Activity|Creator|Version|VersionMajor":
              _this.activity.creator.version_major = _this.curr_text;
              break;
            case "Activities|Activity|Creator|Version|VersionMinor":
              _this.activity.creator.version_minor = _this.curr_text;
              break;
            case "Activities|Activity|Id":
              _this.activity.id = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|AltitudeMeters":
              _this.curr_tkpt.alt_meters = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|DistanceMeters":
              _this.curr_tkpt.dist_meters = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|Extensions|TPX|RunCadence":
              _this.curr_tkpt.run_cadence = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|HeartRateBpm|Value":
              _this.curr_tkpt.hr_bpm = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|Position|LatitudeDegrees":
              _this.curr_tkpt.lat = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|Position|LongitudeDegrees":
              _this.curr_tkpt.lng = _this.curr_text;
              break;
            case "Activities|Activity|Lap|Track|Trackpoint|Time":
              _this.curr_tkpt.time = _this.curr_text;
              break;
            case "Activities|Activity|Lap|TriggerMethod":
              x = 0;
              break;
            case "Author|Build|Version|BuildMajor":
              _this.activity.author.build_major = _this.curr_text;
              break;
            case "Author|Build|Version|BuildMinor":
              _this.activity.author.build_minor = _this.curr_text;
              break;
            case "Author|Build|Version|VersionMajor":
              _this.activity.author.version_major = _this.curr_text;
              break;
            case "Author|Build|Version|VersionMinor":
              _this.activity.author.version_minor = _this.curr_text;
              break;
            case "Author|LangID":
              _this.activity.author.lang = _this.curr_text;
              break;
            case "Author|Name":
              _this.activity.author.name = _this.curr_text;
              break;
            case "Author|PartNumber":
              _this.activity.author.part_number = _this.curr_text;
          }
          _this.tag_stack.pop();
          _this.curr_tag = void 0;
          _this.curr_text = '';
          if (name === _this.root_tag) {
            _this.end_reached = true;
            return _this.finish();
          }
        };
      })(this));
      this.parser.on('text', (function(_this) {
        return function(text) {
          return _this.curr_text = _this.curr_text + text;
        };
      })(this));
      this.parser.on('error', (function(_this) {
        return function(error) {
          return console.log('error ' + JSON.stringify(error));
        };
      })(this));
    }

    Parser.prototype.parse_file = function(filename) {
      var xml_str;
      xml_str = fs.readFileSync(filename);
      return this.parser.parse(xml_str);
    };

    Parser.prototype.curr_path = function() {
      return this.tag_stack.slice(1).join('|');
    };

    Parser.prototype.curr_full_path = function() {
      return this.tag_stack.join('|');
    };

    Parser.prototype.curr_depth = function() {
      return this.tag_stack.length;
    };

    Parser.prototype.finish = function() {
      var altm, distm, dt, et, idx, sec, tkpt, _i, _len, _ref, _results;
      if (this.activity.trackpoints.length > 0) {
        this.tkpt0_time = this.activity.trackpoints[0].time;
        this.tkpt0_date = new Date(this.tkpt0_time);
      }
      _ref = this.activity.trackpoints;
      _results = [];
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        tkpt = _ref[idx];
        tkpt.seq = idx + 1;
        if (this.options.alt_feet === true) {
          altm = Number(tkpt.alt_meters);
          tkpt.alt_feet = Parser.FEET_PER_METER * altm;
        }
        if (this.options.dist_miles === true) {
          distm = Number(tkpt.dist_meters);
          tkpt.dist_miles = distm / Parser.METERS_PER_MILE;
        }
        if (this.options.elapsed === true) {
          if (this.tkpt0_time) {
            dt = new Date(tkpt.time);
            sec = (dt - this.tkpt0_date) / 1000.0;
            et = new m26.ElapsedTime(sec);
            tkpt.elapsed_sec = sec;
            _results.push(tkpt.elapsed_hhmmss = et.as_hhmmss());
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Parser;

  })();

  root.Parser = Parser;

}).call(this);
