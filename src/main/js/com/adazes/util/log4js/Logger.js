import {format} from "util";

/**
 * Logging level constants.
 * @author Reşat SABIQ
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
 * Logs to navigator or Node.js console, using level-specific methods. Use level-checks to log conditionally.
 * 
 * @param	configOrName	Logger name
 * @param	loggingLevel	Logging level (default: INFO)
 * @param	skipPrefix		Optional boolean to skip prepending prefix (name & timestamp)
 * @param	skipTimestamp	Optional boolean to skip prepending timestamp
 * @param	skipName		Optional boolean to skip prepending name
 * @param	useLevelAbbreviation	Optional boolean to prepend level abbreviation to messages
 * @param	dateFormatter	Optional object with .format(date) for custom date-time formatting
 * @author Reşat SABIQ
 */
var Logger = function(configOrName, loggingLevel, skipPrefix, skipTimestamp, skipName, useLevelAbbreviation, dateFormatter) {
	var config = typeof(configOrName) === "object" ? configOrName : {
		name: configOrName,
		level: loggingLevel,
		skipPrefix: skipPrefix,
		skipTimestamp: skipTimestamp,
		skipName: skipName,
		useLevelAbbreviation: useLevelAbbreviation,
		dateFormatter: dateFormatter
	};
	if (!config.level)
		config.level = Level.INFO;
	if (!config.dateFormatter)
		// TODO: since min. IE supported is 11, formatter is going to be defined on all browsers, but currently not in esm used for testing:
		config.dateFormatter = Logger.ENV_NAVIGATOR ? new Intl.DateTimeFormat(navigator.language+ "-u-ca-iso8601", { // iso8601: 2017-11-07
		  year: 'numeric', month: 'numeric', day: 'numeric',
		  hour: 'numeric', minute: 'numeric', second: 'numeric',
		  hour12: false
		}) : undefined;

	this.getName = function() { return config.name }
	this.getLevel = function() { return config.level }
	this.isSkippingPrefix = function() { return config.skipPrefix }
	this.isSkippingTimestamp = function() { return config.skipTimestamp }
	this.isSkippingName = function() { return config.skipName }
	this.isUsingLevelAbbreviation = function() { return config.useLevelAbbreviation }

	this.getDateTimeFormatter = function() { return config.dateFormatter }

	/**
	 * @param	text	message to log
	 * @param	level	level to prefix to the message
	 */
	this.log = function(text) {
		(Logger.ENV_NAVIGATOR ? window : global).console.log(text); // CHECKME
	}
	
	this.isDebugEnabled = function() {
		return config.level.ORDINAL >= Level.DEBUG.ORDINAL;
	}
	
	this.isInfoEnabled = function() {
		return config.level.ORDINAL >= Level.INFO.ORDINAL;
	}
	
	this.isWarnEnabled = function() {
		return config.level.ORDINAL >= Level.WARN.ORDINAL;
	}
	
	this.isErrorEnabled = function() {
		return config.level.ORDINAL >= Level.ERROR.ORDINAL;
	}
	
	this.isFatalEnabled = function() {
		return config.level.ORDINAL >= Level.FATAL.ORDINAL;
	}
	
	this.isTraceEnabled = function() {
		return config.level.ORDINAL >= Level.TRACE.ORDINAL;
	}
	
	this.isAllEnabled = function() {
		return config.level.ORDINAL >= Level.ALL.ORDINAL;
	}

	this.group = function(name) {
		if (name)
			console.group(name);
		else
			console.group();
	}

	this.groupEnd = function() { console.groupEnd() }

	this.functionForLevel = function(messageLevel) {
		var fn;
		switch (messageLevel) {
		case Level.FATAL:
		case Level.ERROR:
			if (Logger.CONSOLE_ERROR_AVAILABLE)
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
		return fn
	}
};

Object.defineProperty(Logger, "CONSOLE_ERROR_AVAILABLE", {
	value:  console.error? true : false,
	writable: false
});
Object.defineProperty(Logger, "CONSOLE_WARN_AVAILABLE", {
	value:  console.warn ? true : false,
	writable: false
});
Object.defineProperty(Logger, "CONSOLE_DEBUG_AVAILABLE", {
	value:  console.debug ? true : false,
	writable: false
});
Object.defineProperty(Logger, "ENV_NAVIGATOR", {
	value:  typeof(navigator) == "object",
	writable: false
});
Object.defineProperty(Logger, "ENV_NODE", {
	value:  !Logger.ENV_NAVIGATOR && typeof(format) == "function",
	writable: false
});
Object.defineProperty(Logger, "ENV_TEST", {
	value: !Logger.ENV_NAVIGATOR && typeof(process) == "object" && typeof(process.env) == "object" && process.env.npm_lifecycle_event == "test",
	writable: false
});

/**
 * If more than 2 params are passed & env. is Node.js, formatting is done using util.format, otherwise the params are passed on to the relevant console method.
 */
/*
 * @return During testing: if Logger's level if OFF, then OFF; else if arguments.length > 2, then formatted string logged; otherwise undefined (as JS consoles do by default)
 */
Object.defineProperty(Logger.prototype, "logl", {
	value: function(messageLevel, text) {
		var off = this.getLevel() == Level.OFF;
		if (!off) {
			var mesaj;
			if (!this.isSkippingPrefix() && this.isUsingLevelAbbreviation())
				mesaj = messageLevel.ABBREVIATION + Level.ABBREVIATION_SUFFIX; 
			if (!this.isSkippingPrefix() && !this.isSkippingName())
				mesaj = mesaj ? mesaj+ ' ' +this.getName() : this.getName();
			if (!this.isSkippingPrefix() && !this.isSkippingTimestamp()) {
				var date = new Date();
				var parenthesesUsed;
				if (mesaj) {
					mesaj += ' ';
					if (!this.isSkippingName()) {
						mesaj += '(';
						parenthesesUsed = true;
					}
				} else
					mesaj = '';
				var formatter = this.getDateTimeFormatter();
				// date.toXYZ: needed for esm (even if not targeting IE 9) 
				mesaj += formatter ? formatter.format(date) : date.toLocaleDateString()+ ", " +date.toLocaleTimeString();
				if (parenthesesUsed)
					mesaj += ')';
			}
			if (mesaj) {
				if (!this.isSkippingName() || !this.isSkippingTimestamp())
					mesaj += ':';
				mesaj += ' ' +text;
			} else
				mesaj = text;
			var fn = this.functionForLevel(messageLevel);
			var mesajFormatted;
			if (arguments.length > 2) {
				var args = new Array(arguments.length-1); //Array.prototype.slice.call(arguments, 1);
				for (var i = 1; i < args.length; i++)
					args[i] = arguments[i+1];
				args[0] = mesaj;
				if (Logger.ENV_NODE) {
					mesajFormatted = format.apply(null, args);
					fn(mesajFormatted);
				} else
					fn.apply(console, args);
			} else
				fn(mesaj);
		}
		if (Logger.ENV_TEST) {
			if (off)
				return Level.OFF;
			if (arguments.length > 2)
				return mesajFormatted; // while testing the resulting formatted strings are asserted
		}
	},
	writable: false
});

Object.defineProperty(Logger, "prepareArguments", {
	value: function(level, params) {
		var args = [level];
		Array.prototype.push.apply(args, params);
		return args;
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "fatal", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.FATAL, arguments));
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "error", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.ERROR, arguments));
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "warn", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.WARN, arguments));
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "info", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.INFO, arguments)); // return this.logl(Level.INFO, text);
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "debug", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.DEBUG, arguments));
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "all", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.ALL, arguments));
	},
	writable: false
});

Object.defineProperty(Logger.prototype, "trace", {
	value: function(text) {
		return Logger.prototype.logl.apply(this, Logger.prepareArguments(Level.TRACE, arguments));
	},
	writable: false
});

export {
	Logger
	, Level
};
