## sb-js

### Purpose

A Node.js library implementing a simple StringBuffer, much like the Java class.

Efficiently uses an Array internally, rather than continually appending Strings.

### Examples

#### Setup

Add sb-js to your project or package.json file:
```
npm install sb-js
```

Require sb-js in your code:
```
StringBuffer = require("sb-js").StringBuffer
```

Note: this library is implemented with CoffeeScript, and these examples are also in CoffeeScript.

#### StringBuffer

Construct a StringBuffer, optionally provide an initial String value.

Methods add(), add_line(), newline(), to_string(), as_lines(), and is_empty() are available.
```
sb = new StringBuffer()
sb.is_empty()  -> true
sb.to_string() -> ""

sb.add("one")
sb.is_empty()  -> false

sb.add(",two")
sb.to_string() -> "one,two"

sb.newline()
sb.add_line("three")

sb.to_string() -> "one,two
three
"
sb.as_lines()  -> "["one,two","three",""]"

sb2 = new StringBuffer("  hello world  ")
sb2.is_empty()  ->  false
sb2.as_lines()  -> "["  hello world  "]"
sb2.to_string() -> "  hello world  "
sb2.to_string(true) -> "hello world"

StringBuffer.VERSION  -> 0.1.1
```

### Release History

* 2015-01-24   v0.1.1  Changed line endings from "\n" to os.EOL.  Replaced jasmine with mocha and istanbul.
* 2014-11-06   v0.1.0  Initial working version.
* 2014-11-06   v0.0.1  alpha 1
