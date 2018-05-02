
/*
Copyright 2015, Christopher Joakim, JoakimSoftware LLC <christopher.joakim@gmail.com>
 */

(function() {
  var StringBuffer, os, root;

  os = require('os');

  StringBuffer = (function() {
    StringBuffer.VERSION = '0.1.1';

    function StringBuffer(s) {
      this.data = [];
      if (s) {
        this.data.push(s);
      }
    }

    StringBuffer.prototype.add = function(s) {
      return this.data.push(s);
    };

    StringBuffer.prototype.add_line = function(s) {
      this.data.push(s);
      return this.data.push(os.EOL);
    };

    StringBuffer.prototype.newline = function() {
      return this.data.push(os.EOL);
    };

    StringBuffer.prototype.to_string = function(trim) {
      if (trim == null) {
        trim = false;
      }
      if (trim) {
        return this.data.join('').trim();
      } else {
        return this.data.join('');
      }
    };

    StringBuffer.prototype.as_lines = function() {
      return this.to_string().split(os.EOL);
    };

    StringBuffer.prototype.is_empty = function() {
      return this.data.length === 0;
    };

    return StringBuffer;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.StringBuffer = StringBuffer;

}).call(this);
