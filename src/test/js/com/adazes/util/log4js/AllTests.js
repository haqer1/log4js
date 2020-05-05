#!/usr/bin/env node
"use strict";

import Logger4Node from "../../../../../../main/js/com/adazes/util/log4js/Logger4Node.js";
import {Level/**/, Logger} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";
import ConsoleInterceptor from "./ConsoleInterceptor.js";
import TestResults from "../TestResults.js";
import TestFailure from "../TestFailure.js";

/*
 * ES6 seems to not be good enough for real OOP due to lack of support for private variables & methods.
 * But at least for a test class it's kind of OK to use it (barely).
 * @author Reşat SABIQ
 */
class AllTests { 
	static defineReadOnlyProperty(name, value) {
		Object.defineProperty(AllTests, name, {
			value: value,
			writable: false, enumerable: false, configurable: false
		});
	}

	testGroupDelegate(groupName, inputIndex, logger) {
		let consoleInterceptor = AllTests.consoleInterceptor;
		let passed = [];
		let failed = [];
		for (var i = 0; i < AllTests.TEST_INPUT[inputIndex].length; i++) {
			var input = AllTests.TEST_INPUT[inputIndex][i];
			let expected;
			switch(i) {
			case 0:
				if (groupName)
					logger.group(groupName);
				else
					logger.group();
				logger.log(input);
				expected = groupName;
				break;
			case 1:
				logger.log(input);
				logger.groupEnd();
				expected = null;
				break;
			}
			let output = consoleInterceptor.getLastMessage();
			if (output === expected) {
				passed.push(i);
				this.ok();
			} else {
				let f = new TestFailure(input, expected, output);
				failed.push(this.handleFailure(f));
			}
		}
		return new TestResults(passed, failed);
	}

	testGroupWithoutName() {
		return this.testGroupDelegate(undefined, 0, AllTests.logger4Node);
	}

	testNamedGroup() {
		const GROUP_NAME = "Named (& nested) group";
		return this.testGroupDelegate(GROUP_NAME, 3, AllTests.logger);
	}

	testLogger4Node() { 
		let logger4Node = AllTests.logger4Node;
		let consoleInterceptor = AllTests.consoleInterceptor;
		let logger4NodeWithName = AllTests.logger4NodeWithName;
		let logger4NodeWithNameWithTimeStamp = AllTests.logger4NodeWithNameWithTimeStamp;
		let logger4NodeWithLevelIndicator = AllTests.logger4NodeWithLevelIndicator;

		logger4Node.group("Logger4Node group");
		let results = this.testGroupWithoutName();
		let passed = results.getPassed();
		let failed = results.getFailed();
		for (var i = 0; i < AllTests.TEST_INPUT[1].length; i++) {
			var input = AllTests.TEST_INPUT[1][i];
			let expected, expectedPattern;
			let regexBasedTest = i == 2 || i == 5 || i == 6 || i == 7;
			switch(i) {
			case 0:
				logger4Node.error(input);
				expected = input;
				break;
			case 1:
				logger4NodeWithName.warn(input);
				expected = AllTests.WARNING_TEST_LOGGER_NAME+ ": " +input;
				break;
			case 2:
				logger4NodeWithNameWithTimeStamp.info(input);
				expectedPattern = new RegExp(AllTests.INFO_TEST_LOGGER_NAME+ " \\(" +AllTests.TIMESTAMP_PATTERN_STR+ "\\): " +input);
				break;
			case 3:
				if (logger4NodeWithNameWithTimeStamp.isDebugEnabled())
					logger4NodeWithNameWithTimeStamp.debug(input);
				expected = null;
				break;
			case 4:
				logger4NodeWithLevelIndicator.all(input);
				expected = Level.ALL.ABBREVIATION + Level.ABBREVIATION_SUFFIX + ' ' +input;
				break;
			}
			let output = consoleInterceptor.getLastMessage();
			if ((!regexBasedTest && output == expected) || (regexBasedTest && expectedPattern.test(output))) {
				passed.push(i);
				if (i == 3)
					logger4Node.debug("no message for " + "DEBUG" + " on INFO logger for: " +input);
				this.ok();
			} else {
				let f = new TestFailure(input, regexBasedTest ? expectedPattern : expected, output);
				failed.push(this.handleFailure(f));
			}
			if (AllTests.COLORING_ENABLED)
				Logger4Node.cursor.reset();
		}
		var results2 = this.testLoggerFormattingDelegate(true);
		results.merge(results2);
		logger4Node.groupEnd();
		return results;
	}

	testLoggerDelegate(inputIndex, addToSubIndex) { 
		let consoleInterceptor = AllTests.consoleInterceptor;
		let logger = AllTests.logger;

		let passed = [];
		let failed = [];
		for (var j = 0; j < AllTests.TEST_INPUT[inputIndex].length; j++) {
			var input = AllTests.TEST_INPUT[inputIndex][j];
			let expected, expectedPattern;
			let i = j + addToSubIndex;
			let regexBasedTest = i == 0 || i == 1 || i == 2 || i == 5;
			let output, returned;
			switch(i) {
			case 0:
				returned = AllTests.loggerWithLevelIndicator.all(input);
				expectedPattern = new RegExp(Level.ALL.ABBREVIATION + Level.ABBREVIATION_SUFFIX + ' ' +AllTests.TIMESTAMP_PATTERN_STR+ ": " +input);
				break;
			case 1:
				returned = AllTests.loggerWithTimestamp.debug(input);
				expectedPattern = new RegExp('^' +AllTests.TIMESTAMP_PATTERN_STR+ ": " +input);
				break;
			case 2:
				if (AllTests.loggerWithFullPrefix.isDebugEnabled())
					AllTests.loggerWithFullPrefix.debug(input);
				expectedPattern = new RegExp(Level.DEBUG.ABBREVIATION + Level.ABBREVIATION_SUFFIX + ' ' +AllTests.FULL_PREFIX_TEST_LOGGER_NAME+ " \\(" +AllTests.TIMESTAMP_PATTERN_STR+ "\\): " +input);
				break;
			case 3:
				if (logger.isTraceEnabled())
					logger.trace(input);
				expected = null;
				break;
			case 4:
				output = AllTests.loggerWithLevelOfOFF.info(input);
				expected = Level.OFF;
				break;
			case 5:
				output = AllTests.loggerWithMsDateTimeFormatter.info(input);
				expectedPattern = new RegExp("^AllTests \\((\\d{13,})\\): " +input);
			}
			if (output == undefined)
				output = consoleInterceptor.getLastMessage();
			if ((!regexBasedTest && output == expected) 
					|| (regexBasedTest && expectedPattern.test(output) 
							&& (returned == undefined || i > 1) 
								&& i != 5 || Number.parseInt(expectedPattern.exec(output)[1]) > DT_FORMATTER_TEST_MS_SENTINEL)) {
				passed.push(i);
				if (i == 3 || i == 4)
					logger.debug("no message for " + (i == 3 ? "TRACE" : "INFO") + " on " +(i == 3 ? "INFO" : "OFF")+ " logger for: " +input);
				this.ok();
			} else {
				let f = new TestFailure(input, regexBasedTest ? expectedPattern : expected, output);
				failed.push(this.handleFailure(f));
			}
			if (AllTests.COLORING_ENABLED)
				Logger4Node.cursor.reset();
		}
		var results = new TestResults(passed, failed);
		if (inputIndex == 4) {
			var results2 = this.testLoggerFormattingDelegate(false);
			results.merge(results2);
			logger.groupEnd();
		}
		return results;
	}

	testLoggerFormattingDelegate(forNode) { 
		const INPUT_INDEX = 5;
		let consoleInterceptor = AllTests.consoleInterceptor;
		let logger = forNode ? AllTests.logger4Node : AllTests.logger;

		let passed = [];
		let failed = [];
		logger.group("Formatting group (for Node: " +forNode+ ')');
		var inputOutput = AllTests.TEST_INPUT[INPUT_INDEX];
		var methods = ["error", "warn", "info", "debug"];
		for (var i = 0; i < inputOutput.length; i++) {
			var params = inputOutput[i][0];
	//		console.log("params: " +params+ " " +params.length);
			let output = (forNode ? Logger4Node : Logger).prototype[methods[i]].apply(logger, params);
			let expected = inputOutput[i][1][0];
			if (output == expected) {
				passed.push(INPUT_INDEX);
				this.ok();
			} else {
				let f = new TestFailure(params, expected, output);
				failed.push(this.handleFailure(f));
			}
			if (AllTests.COLORING_ENABLED)
				Logger4Node.cursor.reset();
		}
		logger.groupEnd();
		return new TestResults(passed, failed);
	}

	testLogger() { 
		AllTests.logger.group("Logger group");
		let results = this.testLoggerDelegate(2, 0);
		let groupTestResults = this.testNamedGroup();
		results.merge(groupTestResults);
		let results2 = this.testLoggerDelegate(4, AllTests.TEST_INPUT[2].length);
		results.merge(results2);
		return results;
	}

	testLoggers() {
		let results = allTests.testLogger4Node();
		let results2 = allTests.testLogger();
		results.merge(results2);
		return results;
	}
	
	ok() {
		if (AllTests.COLORING_ENABLED)
			Logger4Node.cursor.green().write("✓ \n").reset();
	}

	handleFailure(testFailure) {
		let logger4Node = AllTests.logger4Node;
		let consoleInterceptor = AllTests.consoleInterceptor;
		if (AllTests.COLORING_ENABLED)
			Logger4Node.cursor.red().write("✘ ");
		logger4Node.warn("\t=== expected: ===");
		logger4Node.warn(testFailure.getExpected());
		logger4Node.warn("\t=== actual: ===");
		logger4Node.warn(testFailure.getActual());
		consoleInterceptor.resetMessage();
		return testFailure;
	}

	summarize(results) {
		let logger4Node = AllTests.logger4Node;
		const TEST_INPUT = AllTests.TEST_INPUT;
		logger4Node.log("-----------------------------------------------------------");
		let passedCount = results.getPassed().length;
		let testsCount = 0;
		for (let i = 0; i < TEST_INPUT.length; i++) {
			var size = TEST_INPUT[i].length;
			testsCount += i == 5 ? size*2 : size;
		}
		var ok = results.getFailed().length == 0;
		if (ok)
			if (AllTests.COLORING_ENABLED)
				Logger4Node.cursor.green();
		logger4Node.log("# Passed: " +passedCount+ '/' +testsCount+ " (" +Math.round(passedCount * 100 / testsCount)+ "%)");
	}
}
AllTests.defineReadOnlyProperty("WARNING_TEST_LOGGER_NAME", "WarningTest");
AllTests.defineReadOnlyProperty("INFO_TEST_LOGGER_NAME", "InfoTest");
AllTests.defineReadOnlyProperty("ALL_TESTS_LOGGER_NAME", "AllTests");
AllTests.defineReadOnlyProperty("FULL_PREFIX_TEST_LOGGER_NAME", "FullPrefixTest");
AllTests.defineReadOnlyProperty("logger4Node", new Logger4Node(AllTests.ALL_TESTS_LOGGER_NAME, Level.INFO, true));
AllTests.defineReadOnlyProperty("logger4NodeWithName", new Logger4Node({name: AllTests.WARNING_TEST_LOGGER_NAME, skipTimestamp: true}));
AllTests.defineReadOnlyProperty("logger4NodeWithNameWithTimeStamp", new Logger4Node(AllTests.INFO_TEST_LOGGER_NAME, Level.INFO, false));
AllTests.defineReadOnlyProperty("logger4NodeWithLevelIndicator", new Logger4Node(AllTests.ALL_TESTS_LOGGER_NAME, Level.ALL, false, true, true, true));
AllTests.defineReadOnlyProperty("loggerWithLevelIndicator", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.ALL, false, false, true, true));
AllTests.defineReadOnlyProperty("loggerWithTimestamp", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.DEBUG, false, false, true));
AllTests.defineReadOnlyProperty("loggerWithFullPrefix", new Logger({
	name: AllTests.FULL_PREFIX_TEST_LOGGER_NAME,
	level: Level.ALL,
	useLevelAbbreviation: true}));
AllTests.defineReadOnlyProperty("logger", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.INFO, true));
AllTests.defineReadOnlyProperty("loggerWithLevelOfOFF", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.OFF, true));
AllTests.defineReadOnlyProperty("loggerWithMsDateTimeFormatter", new Logger({
	name: AllTests.ALL_TESTS_LOGGER_NAME,
	dateFormatter: { format: function(date) {return date.valueOf()}}}));

AllTests.defineReadOnlyProperty("consoleInterceptor", new ConsoleInterceptor());

AllTests.defineReadOnlyProperty("TIMESTAMP_PATTERN_STR",  "\\d{4}-\\d{1,2}-\\d{1,2},? (.* )?\\d{1,2}:\\d{2}:\\d{2}");
AllTests.defineReadOnlyProperty("COLORING_ENABLED", true);

const GROUP_END_TEST_STRING = "Grouping test: .groupEnd() call passed on OK.";
const DT_FORMATTER_TEST_MS_SENTINEL = 1588665380753;

AllTests.defineReadOnlyProperty("TEST_INPUT", [
	[
	"Grouping test: no group name in console when no group name passed in as param (i.e., group name is undefined).", 
	GROUP_END_TEST_STRING
	],
	[
	"Error test with named Logger4Node with prefix skipped", 
	"Warn test with named Logger4Node",
	"Info test with named Logger4Node with timestamp",
	"Debug test with named Logger4Node with timestamp and with level conditional",
	"All test with Logger4Node with level indicator"
	],
	[
	"All test with Logger with timestamp & level indicator with verification of return value of undefined",
	"All test with Logger with timestamp with verification of return value of undefined"
	],
	[
	"Grouping test: group name is passed on OK if passed in as param.", 
	GROUP_END_TEST_STRING
	],
	[
	"All test w/ named Logger w/ timestamp, & level indicator: also testing level indicator being call-specific",
	"Trace test with named Logger with level conditional",
	"Info test with named Logger with level of OFF",
	"Info test with date-time formatter showing ms since epoch"
	],
	[
		[
			[ "Formatting %s: %d", "test", 1 ],
			[ "Formatting test: 1" ]
		],
		[
			[ "Formatting %s with unused param: %d %s", "test", 2 ],
			[ "Formatting test with unused param: 2 %s" ]
		],
		[
			[ "Formatting %s with excessive param: %d", "test", 3, "(unmapped param)" ],
			[ "Formatting test with excessive param: 3 (unmapped param)" ]
		],
		[
			[ "Formatting %s with a sign that doesn't consume an arg: %f (100%% correctness seeked)", "test", 4.01 ],
			[ "Formatting test with a sign that doesn't consume an arg: 4.01 (100% correctness seeked)" ]
		]
	]
]
);
let allTests = new AllTests();
let results = allTests.testLoggers();
allTests.summarize(results);

