# log4js

A simple, very light-weight Logger implementation for JS (inspired by log4j)

## Installation

```
npm i --save-dev @adazes/log4js
```

## Usage
### Importing
#### Node.js
```javascript
import * as log4js from "@adazes/log4js";
```
#### Browsers
```
<script src="your/js/include/path/log4js-for-browsers.min.js" type="text/javascript"></script> <!-- 6.6KB -->
```

### Using (both (Node.js & Browsers))
```javascript
var logger = new log4js.Logger("Demo", 
	log4js.Level.WARN,  // Level.OFF can also be used to turn logging off completely
	true);
if (logger.isInfoEnabled())
	logger.info("This isn't logged since level is higher than threshold set");

var logger2 = new log4js.Logger({
	name: "Logger initialized with a config object",
	level: log4js.Level.ALL,
	useLevelAbbreviation: true});
logger2.all("This is logged");
// A> Logger initialized with a config object (2022-6-10, 14:14:30): This is logged
```

### Config object usable during construction (with default values indicated)
```javascript
{
	name: '',
	level: log4js.Level.INFO,
	skipPrefix: false,
	skipTimestamp: false,
	skipName: false,
	useLevelAbbreviation: false,
	dateFormatter: new Intl.DateTimeFormat(navigator.language+ "-u-ca-iso8601", {
		  year: 'numeric', month: 'numeric', day: 'numeric',
		  hour: 'numeric', minute: 'numeric', second: 'numeric',
		  hour12: false
	}
}
```
These same settings can be passed in, in this exact order, as individual constructor parameters, which frequently results in less typing. See `var logger` for an example in [Using](### Using (both (Node.js & Browsers))) section above.
