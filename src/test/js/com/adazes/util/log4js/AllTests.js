#!/usr/bin/env node
"use strict";

import Logger4Node from "../../../../../../main/js/com/adazes/util/log4js/Logger4Node.js";
import {Level/**/, Logger} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";
import ConsoleInterceptor from "./ConsoleInterceptor.js";
import TestResults from "../TestResults.js";
import TestFailure from "../TestFailure.js";

/*
 * ES6 is not good enough for real OOP due to lack of support for private variables.
 * But for test class it's kind of OK to use it (barely).
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
				let f = new TestFailure(input, expected, output);
				failed.push(this.handleFailure(f));
			}
			Logger4Node.cursor.reset();
		}
		logger4Node.groupEnd();
		return results;
	}

	testLoggerDelegate(inputIndex, addToSubIndex) { 
		let consoleInterceptor = AllTests.consoleInterceptor;
		let loggerWithLevelIndicator = AllTests.loggerWithLevelIndicator;
		let loggerWithTimestamp = AllTests.loggerWithTimestamp;
		let loggerWithFullPrefix = AllTests.loggerWithFullPrefix;
		let logger = AllTests.logger;

		let passed = [];
		let failed = [];
		for (var j = 0; j < AllTests.TEST_INPUT[inputIndex].length; j++) {
			var input = AllTests.TEST_INPUT[inputIndex][j];
			let expected, expectedPattern;
			let i = j + addToSubIndex;
			let regexBasedTest = i == 0 || i == 1 || i == 2;
			switch(i) {
			case 0:
				loggerWithLevelIndicator.all(input);
				expectedPattern = new RegExp("A> " +AllTests.TIMESTAMP_PATTERN_STR+ ": " +input);
				break;
			case 1:
				loggerWithTimestamp.debug(input);
				expectedPattern = new RegExp('^' +AllTests.TIMESTAMP_PATTERN_STR+ ": " +input);
				break; // TODO: add 2 tests: group with name assert & groupEnd with name reset assert
			case 2:
				if (loggerWithFullPrefix.isDebugEnabled())
					loggerWithFullPrefix.debug(input);
				expectedPattern = new RegExp("^D> " +AllTests.FULL_PREFIX_TEST_LOGGER_NAME+ " \\(" +AllTests.TIMESTAMP_PATTERN_STR+ "\\): " +input);
				break;
			case 3:
				if (logger.isTraceEnabled())
					logger.trace(input);
				expected = null;
				break;
			}
			let output = consoleInterceptor.getLastMessage();
			if ((!regexBasedTest && output == expected) || (regexBasedTest && expectedPattern.test(output))) {
				passed.push(i);
				if (i == 3) {
					logger.debug("no message for " + "TRACE" + " on INFO logger for: " +input);
					logger.groupEnd();
				}
				this.ok();
			} else {
				let f = new TestFailure(input, expected, output);
				failed.push(this.handleFailure(f));
			}
			Logger4Node.cursor.reset();
		}
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
		Logger4Node.cursor.green().write("✓ \n").reset();
	}

	handleFailure(testFailure) {
		let logger4Node = AllTests.logger4Node;
		let consoleInterceptor = AllTests.consoleInterceptor;
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
		for (let i = 0; i < TEST_INPUT.length; i++)
			testsCount += TEST_INPUT[i].length;
		var ok = results.getFailed().length == 0;
		if (ok)
			Logger4Node.cursor.green();
		logger4Node.log("# Passed: " +passedCount+ '/' +testsCount+ " (" +Math.round(passedCount * 100 / testsCount)+ "%)");
	}
}
AllTests.defineReadOnlyProperty("WARNING_TEST_LOGGER_NAME", "WarningTest");
AllTests.defineReadOnlyProperty("INFO_TEST_LOGGER_NAME", "InfoTest");
AllTests.defineReadOnlyProperty("ALL_TESTS_LOGGER_NAME", "AllTests");
AllTests.defineReadOnlyProperty("FULL_PREFIX_TEST_LOGGER_NAME", "FullPrefixTest");
AllTests.defineReadOnlyProperty("logger4Node", new Logger4Node(AllTests.ALL_TESTS_LOGGER_NAME, Level.INFO, true));
AllTests.defineReadOnlyProperty("logger4NodeWithName", new Logger4Node(AllTests.WARNING_TEST_LOGGER_NAME, Level.INFO, false, true));
AllTests.defineReadOnlyProperty("logger4NodeWithNameWithTimeStamp", new Logger4Node(AllTests.INFO_TEST_LOGGER_NAME, Level.INFO, false));
AllTests.defineReadOnlyProperty("logger4NodeWithLevelIndicator", new Logger4Node(AllTests.ALL_TESTS_LOGGER_NAME, Level.ALL, false, true, true, true));
AllTests.defineReadOnlyProperty("loggerWithLevelIndicator", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.ALL, false, false, true, true));
AllTests.defineReadOnlyProperty("loggerWithTimestamp", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.DEBUG, false, false, true));
AllTests.defineReadOnlyProperty("loggerWithFullPrefix", new Logger(AllTests.FULL_PREFIX_TEST_LOGGER_NAME, Level.ALL, false, false, false, true));
AllTests.defineReadOnlyProperty("logger", new Logger(AllTests.ALL_TESTS_LOGGER_NAME, Level.INFO, true));

AllTests.defineReadOnlyProperty("consoleInterceptor", new ConsoleInterceptor());

AllTests.defineReadOnlyProperty("TIMESTAMP_PATTERN_STR",  "\\d{4}-\\d{1,2}-\\d{1,2},? (.* )?\\d{2}:\\d{2}:\\d{2}");

const GROUP_END_TEST_STRING = "Grouping test: .groupEnd() call passed on OK.";
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
	"All test with Logger4Node with level indicator",
	],
	[
	"All test with Logger with timestamp & level indicator",
	"All test with Logger with timestamp",
	],
	[
	"Grouping test: group name is passed on OK if passed in as param.", 
	GROUP_END_TEST_STRING
	],
	[
	"All test with named Logger with timestamp, & level indicator: also testing level indicator being call-specific",
	"Trace test with named Logger with level conditional"
	]
]
);
let allTests = new AllTests();
let results = allTests.testLoggers();
allTests.summarize(results);

