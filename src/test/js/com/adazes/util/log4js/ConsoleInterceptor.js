import {Level} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";

var ConsoleInterceptor = function() {
	let lastMessage;
	let bu = this;

	let origMethods = {};
	
	function init() {
		let groupMethods = ["group", "groupEnd"]
		let levelAndGroupMethods = Level.ALL_LEVELS_ARRAY.concat(groupMethods);
		for (let i in levelAndGroupMethods) {
			let levelOrGroup = Level.ALL_LEVELS_ARRAY[i];
			if (levelOrGroup != Level.OFF) {
				let methodName = levelOrGroup ? levelOrGroup.NAME.toLowerCase() : levelAndGroupMethods[i];
				origMethods[methodName] = global.console[methodName];
				global.console[methodName] = bu[methodName];
			}
		}
		origMethods["log"] = global.console["log"];
	}

	this.fatal = function(s) {
		origMethods.error.apply(console, arguments);
		lastMessage = s;
	}

	this.error = function(s) {
		origMethods.error.apply(console, arguments);
		lastMessage = s;
	}

	this.warn = function(s) { //		console.log("overridden warn:");
		origMethods.warn.apply(console, arguments);
		lastMessage = s;
	}

	this.info = function(s) {
		origMethods.info.apply(console, arguments);
		lastMessage = s;
	}

	this.debug = function(s) {
		origMethods.debug.apply(console, arguments);
		lastMessage = s;
	}

	this.trace = function(s) {
		origMethods.trace.apply(console, arguments);
		lastMessage = s;
	}

	this.all = function(s) {
		origMethods.all.apply(console, arguments);
		lastMessage = s;
	}

	this.log = function(s) {
		origMethods.log.apply(console, arguments);
		lastMessage = s;
	}

	this.getLastMessage = function(skipResetting) {
		var lm = lastMessage;
		if (!skipResetting)
			lastMessage = null;
		return lm;
	}

	this.resetMessage = function() { lastMessage = null }

	this.group = function(name) {
		if (name)
			origMethods.group(name);
		else
			origMethods.group();
		lastMessage = name;
	}

	this.groupEnd = function() {
		origMethods.groupEnd();
		lastMessage = null;
	}

	init();
};

export default ConsoleInterceptor;
