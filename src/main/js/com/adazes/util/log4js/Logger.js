/**
 * Logging level constants.
 */
var Level = {};
Object.defineProperty(Level, "ABBREVIATION_SUFFIX", {
	value: '>',
	writable: false
});

Object.defineProperty(Level, "OFF", {
	value: {},
	writable: false
});
Object.defineProperty(Level.OFF, "ORDINAL", {
	value: 0,
	writable: false
});
Object.defineProperty(Level.OFF, "NAME", {
	value: "OFF",
	writable: false
});
Object.defineProperty(Level.OFF, "ABBREVIATION", {
	value: Level.OFF.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "FATAL", {
	value: {},
	writable: false
});
Object.defineProperty(Level.FATAL, "ORDINAL", {
	value: 100,
	writable: false
});
Object.defineProperty(Level.FATAL, "NAME", {
	value: "FATAL",
	writable: false
});
Object.defineProperty(Level.FATAL, "ABBREVIATION", {
	value: Level.FATAL.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "ERROR", {
	value: {},
	writable: false
});
Object.defineProperty(Level.ERROR, "ORDINAL", {
	value: 200,
	writable: false
});
Object.defineProperty(Level.ERROR, "NAME", {
	value: "ERROR",
	writable: false
});
Object.defineProperty(Level.ERROR, "ABBREVIATION", {
	value: Level.ERROR.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "WARN", {
	value: {},
	writable: false
});
Object.defineProperty(Level.WARN, "ORDINAL", {
	value: 300,
	writable: false
});
Object.defineProperty(Level.WARN, "NAME", {
	value: "WARN",
	writable: false
});
Object.defineProperty(Level.WARN, "ABBREVIATION", {
	value: Level.WARN.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "INFO", {
	value: {},
	writable: false
});
Object.defineProperty(Level.INFO, "ORDINAL", {
	value: 400,
	writable: false
});
Object.defineProperty(Level.INFO, "NAME", {
	value: "INFO",
	writable: false
});
Object.defineProperty(Level.INFO, "ABBREVIATION", {
	value: Level.INFO.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "DEBUG", {
	value: {},
	writable: false
});
Object.defineProperty(Level.DEBUG, "ORDINAL", {
	value: 500,
	writable: false
});
Object.defineProperty(Level.DEBUG, "NAME", {
	value: "DEBUG",
	writable: false
});
Object.defineProperty(Level.DEBUG, "ABBREVIATION", {
	value: Level.DEBUG.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "TRACE", {
	value: {},
	writable: false
});
Object.defineProperty(Level.TRACE, "ORDINAL", {
	value: 600,
	writable: false
});
Object.defineProperty(Level.TRACE, "NAME", {
	value: "TRACE",
	writable: false
});
Object.defineProperty(Level.TRACE, "ABBREVIATION", {
	value: Level.TRACE.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "ALL", {
	value: {},
	writable: false
});
Object.defineProperty(Level.ALL, "ORDINAL", {
	value: 700,
	writable: false
});
Object.defineProperty(Level.ALL, "NAME", {
	value: "ALL",
	writable: false
});
Object.defineProperty(Level.ALL, "ABBREVIATION", {
	value: Level.ALL.NAME.charAt(0),
	writable: false
});

Object.defineProperty(Level, "ALL_LEVELS_ARRAY", {
	value: [Level.OFF, Level.FATAL, Level.ERROR, Level.WARN, Level.INFO, Level.DEBUG, Level.TRACE, Level.ALL],
	writable: false
});

/**
 * Logs to navigator console, using level-specific methods. Use level-checks to log conditionally.
 * 
 * @param	isim		Logger name
 * @param	loggingLevel	Logging level
 * @param	skipTimestamp	Optional boolean to skip prepending timestamp
 */
var Logger = function(isim, loggingLevel, skipPrefix, skipTimestamp, skipName, prependLevelAbbreviation) {

	var level = loggingLevel ? loggingLevel : Level.INFO;
	var errorUsable = console.error ? true : false;
	// TODO: since min. IE supported is 11, formatter is going to be defined on all browsers, but currently not in esm used for testing:
	var formatter = typeof navigator == "object" ? new Intl.DateTimeFormat(navigator.language+ "-u-ca-iso8601", { // iso8601: 2017-11-07
		  year: 'numeric', month: 'numeric', day: 'numeric',
		  hour: 'numeric', minute: 'numeric', second: 'numeric',
		  hour12: false
		}) : undefined;

	/**
	 * @param	text	message to log
	 * @param	level	level to prefix to the message
	 */
	this.log = function(text, messageLevel) {
		var notOff = level != Level.OFF;
		if (notOff) {
			var mesaj;
			if (!skipPrefix && prependLevelAbbreviation )
				mesaj = messageLevel.ABBREVIATION + Level.ABBREVIATION_SUFFIX; 
			if (!skipPrefix && !skipName)
				mesaj = mesaj ? mesaj+ ' ' +isim : isim;
			if (!skipPrefix && !skipTimestamp) {
				var date = new Date();
				var parenthesesUsed;
				if (mesaj)
					mesaj += ' ';
				if (!skipName) {
					mesaj += '(';
					parenthesesUsed = true;
				}
				if (!mesaj)
					mesaj = '';
				// date.toXYZ: needed for esm (even if not targeting IE 9) 
				mesaj += formatter ? formatter.format(date) : date.toLocaleDateString()+ ", " +date.toLocaleTimeString();
				if (parenthesesUsed)
					mesaj += ')';
			}
			if (mesaj) {
				if (!skipName || !skipTimestamp)
					mesaj += ':';
				mesaj += ' ' +text;
			} else
				mesaj = text;
			var fn;
			switch (messageLevel) {
			case Level.FATAL:
			case Level.ERROR:
				if (errorUsable)
					fn = console.error;
				break;
			case Level.WARN:
				fn = Logger.CONSOLE_WARN_AVAILABLE ? console.warn : console.error;
				break;
			case Level.INFO:
				fn = console.info;
				break;
			case Level.DEBUG:
			case Level.ALL:
				if (Logger.CONSOLE_DEBUG_AVAILABLE)
					fn = console.debug;
				break;
			case Level.TRACE:
				fn = console.trace;
			}
			if (!fn) 
				fn = console.log;
			fn(mesaj);
		}
		return notOff;
	}

	this.debug = function(text) {
		return this.log(text, Level.DEBUG);
	}
	
	this.isDebugEnabled = function() {
		return level.ORDINAL >= Level.DEBUG.ORDINAL;
	}
	
	this.isInfoEnabled = function() {
		return level.ORDINAL >= Level.INFO.ORDINAL;
	}
	
	this.isWarnEnabled = function() {
		return level.ORDINAL >= Level.WARN.ORDINAL;
	}
	
	this.isErrorEnabled = function() {
		return level.ORDINAL >= Level.ERROR.ORDINAL;
	}
	
	this.isFatalEnabled = function() {
		return level.ORDINAL >= Level.FATAL.ORDINAL;
	}
	
	this.trace = function(text) {
		return this.log(text, Level.TRACE);
	}
	
	this.isTraceEnabled = function() {
		return level.ORDINAL >= Level.TRACE.ORDINAL;
	}
	
	this.all = function(text) {
		return this.log(text, Level.ALL);
	}
	
	this.isAllEnabled = function() {
		return level.ORDINAL >= Level.ALL.ORDINAL;
	}

	this.group = function(name) {
		if (name)
			console.group(name);
		else
			console.group();
	}

	this.groupEnd = function() { console.groupEnd() }
};

Object.defineProperty(Logger, "CONSOLE_WARN_AVAILABLE", {
	value:  console.warn ? true : false,
	writable: false
});

Object.defineProperty(Logger, "CONSOLE_DEBUG_AVAILABLE", {
	value:  console.debug ? true : false,
	writable: false
});

Object.defineProperty(Logger.prototype, "fatal", {
	value: function(text) {
		this.log(text, Level.FATAL);
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "error", {
	value: function(text) {
		return this.log(text, Level.ERROR);
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "warn", {
	value: function(text) {
		return this.log(text, Level.WARN);
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "info", {
	value: function(text) {
		return this.log(text, Level.INFO);
	},
	writable: false
});

export {
	Logger
	, Level
};
