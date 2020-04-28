import {Level} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";

var ConsoleInterceptor = function() {
	let lastMessage;
	let bu = this;

	let origMethods = {};
	
	function init() {
		for (let i in Level.ALL_LEVELS_ARRAY) {
			let level = Level.ALL_LEVELS_ARRAY[i];
			if (level != Level.OFF) {
				let levelLC = Level.ALL_LEVELS_ARRAY[i].name.toLowerCase();
				origMethods[levelLC] = global.console[levelLC];
				global.console[levelLC] = bu[levelLC];
			}
		}
	}

	this.fatal = function(s) {
		origMethods.error(s);
		lastMessage = s;
	}

	this.error = function(s) {
		origMethods.error(s);
		lastMessage = s;
	}

	this.warn = function(s) { //		console.log("overridden warn:");
		origMethods.warn(s);
		lastMessage = s;
	}

	this.info = function(s) {
		origMethods.info(s);
		lastMessage = s;
	}

	this.debug = function(s) {
		origMethods.debug(s);
		lastMessage = s;
	}

	this.trace = function(s) {
		origMethods.trace(s);
		lastMessage = s;
	}

	this.all = function(s) {
		origMethods.all(s);
		lastMessage = s;
	}

	this.getLastMessage = function() {
		var lm = lastMessage;
		lastMessage = null;
		return lm;
	}

	this.resetMessage = function() { lastMessage = null }

	init();
};

export default ConsoleInterceptor;
