import * as logging from "./Logger.js";

/**
 * Logs to process stream using Node's API, including support for coloring according to level.
 * When logging without coloring is needed, Logger (the parent class) should be used.
 * 
 * @see	Logger
 * @author Reşat SABIQ
 */
var Logger4Node = function(configOrName, loggingLevel, skipPrefix, skipTimestamp, skipName, useLevelAbbreviation, dateFormatter) {
	logging.Logger.call(this, configOrName, loggingLevel, skipPrefix, skipTimestamp, skipName, useLevelAbbreviation, dateFormatter);

	this.decorateErrorOutput = function(start) {
		if (start) {
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.red();
		} else {
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.reset();
		}
	}
};

Object.defineProperty(Logger4Node, "PROCESS_STDOUT_WRITABLE", {
	value:  typeof process == "object" && typeof process.stdout == "object" && typeof process.stdout.write == "function",
	writable: false
});

Object.defineProperty(Logger4Node, "escSequence", {
	value: function(s) {
		return function() {
			process.stdout.write("\u001b" + s);
			return this;
		};
	},
	writable: false
});

Object.defineProperty(Logger4Node, "cursor", {
	value: {},
	enumerable: false, configurable: false, writable: false
});
Object.defineProperty(Logger4Node.cursor, "write", {
	value: function(s) {
		process.stdout.write(s);
		return this;
	},
	writable: false
});
Object.defineProperty(Logger4Node.cursor, "green", {
	value: Logger4Node.escSequence("[0;32m"),
	writable: false
});
Object.defineProperty(Logger4Node.cursor, "red", {
	value: Logger4Node.escSequence("[0;31m"),
	writable: false
});
Object.defineProperty(Logger4Node.cursor, "cyan", {
	value: Logger4Node.escSequence("[0;36m"),
	writable: false
});
Object.defineProperty(Logger4Node.cursor, "darkblue", {
	value: Logger4Node.escSequence("[0;38;5;25m"),
	writable: false
});
Object.defineProperty(Logger4Node.cursor, "reset", {
	value: Logger4Node.escSequence("[0m"),
	writable: false
});

Logger4Node.prototype = Object.create(logging.Logger.prototype, {
	logger: {
		value: new logging.Logger("Logger4Node", true),
		writable: false
	},
	fatal: {
		value: function(text) {
			this.decorateErrorOutput(true);
			var result = logging.Logger.prototype.fatal.apply(this, arguments);
			this.decorateErrorOutput(false);
			return result;
		},
		writable: false
	},
	error: {
		value: function(text) {
			this.decorateErrorOutput(true);
			var result = logging.Logger.prototype.error.apply(this, arguments);
			this.decorateErrorOutput(false);
			return result;
		},
		writable: false
	},
	warn: {
		value: function(text) {
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.cyan();
			var result = logging.Logger.prototype.warn.apply(this, arguments);
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.reset();
			return result;
		},
		writable: false
	},
	info: {
		value: function(text) {
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.darkblue();
			var result = logging.Logger.prototype.info.apply(this, arguments);
			if (Logger4Node.PROCESS_STDOUT_WRITABLE)
				Logger4Node.cursor.reset();
			return result;
		},
		writable: false
	}
});

export default Logger4Node;
