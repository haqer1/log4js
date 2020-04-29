#!/usr/bin/env node
"use strict";

import Logger4Node from "../../../../../../main/js/com/adazes/util/log4js/Logger4Node.js";
import {Level/**/, Logger} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";
import ConsoleInterceptor from "./ConsoleInterceptor.js";

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

	testLogger() { 
		let passed = [];
		let failed = [];
		for (var i = 0; i < AllTests.TEST_INPUT_OUTPUT.length; i++) {
			var input = AllTests.TEST_INPUT_OUTPUT[i];
			let fn;
			let expected, expectedPattern;
			let timestampPatternStr = "\\d{4}-\\d{1,2}-\\d{1,2},? (.* )?\\d{2}:\\d{2}:\\d{2}";
			let regexBasedTest = i == 3 || i == 6 || i == 7 || i == 8;
			let logger4Node = AllTests.logger4Node;
			let consoleInterceptor = AllTests.consoleInterceptor;
			let logger4NodeWithName = AllTests.logger4NodeWithName;
			let logger4NodeWithNameWithTimeStamp = AllTests.logger4NodeWithNameWithTimeStamp;
			let logger4NodeWithLevelIndicator = AllTests.logger4NodeWithLevelIndicator;
			let loggerWithLevelIndicator = AllTests.loggerWithLevelIndicator;
			let loggerWithTimestamp = AllTests.loggerWithTimestamp;
			let loggerWithFullPrefix = AllTests.loggerWithFullPrefix;
			let logger = AllTests.logger;
			switch(i) {
			case 0:
				logger4Node.group("Logger4Node group");
				logger4Node.group();
				expected = null;
				break;
			case 1:
				logger4Node.error(input);
				expected = input;
				break;
			case 2:
				logger4NodeWithName.warn(input);
				expected = AllTests.WARNING_TEST_LOGGER_NAME+ ": " +input;
				break;
			case 3:
				logger4NodeWithNameWithTimeStamp.info(input);
				expectedPattern = new RegExp(AllTests.INFO_TEST_LOGGER_NAME+ " \\(" +timestampPatternStr+ "\\): " +input);
				break;
			case 4:
				if (logger4NodeWithNameWithTimeStamp.isDebugEnabled())
					logger4Node.debug(input);
				expected = null;
				break;
			case 5:
				logger4NodeWithLevelIndicator.all(input);
				expected = "A> " +input;
				break;
			case 6:
				loggerWithLevelIndicator.group("Logger group");
				loggerWithLevelIndicator.all(input);
				expectedPattern = new RegExp("A> " +timestampPatternStr+ ": " +input);
				break;
			case 7:
				loggerWithTimestamp.debug(input);
				expectedPattern = new RegExp('^' +timestampPatternStr+ ": " +input);
				break; // TODO: add 2 tests: group with name assert & groupEnd with name reset assert
			case 8:
				if (loggerWithFullPrefix.isDebugEnabled())
					loggerWithFullPrefix.debug(input);
				expectedPattern = new RegExp("^D> " +AllTests.FULL_PREFIX_TEST_LOGGER_NAME+ " \\(" +timestampPatternStr+ "\\): " +input);
				break;
			case 9:
				if (logger.isTraceEnabled())
					logger.trace(input);
				expected = null;
				break;
			}
			let output = consoleInterceptor.getLastMessage();
			if ((!regexBasedTest && output == expected) || (regexBasedTest && expectedPattern.test(output))) {
				passed.push(i);
				if (i == 0)
					logger4Node.log(input);
				if (i == 4 || i == 9) {
					logger4Node.debug("no message for " +(i == 3 ? "DEBUG" : "TRACE") + " on INFO logger for: " +input);
					if (i == 9)	
						logger.groupEnd();
				} else if (i == 0 || i == 5)
					logger4Node.groupEnd();
				Logger4Node.cursor.green().write("✓ \n");
			} else {
				let f = {i: i, input: input, expected: !regexBasedTest ? expected : expectedPattern, output: output};
				failed.push(f);
				Logger4Node.cursor.red().write("✘ ");
				logger4Node.warn("\t=== expected: ===");
				logger4Node.warn(f.expected);
				logger4Node.warn("\t=== output: ===");
				logger4Node.warn(f.output);
				consoleInterceptor.resetMessage();
		//		logger4Node.log(input);
			}
			Logger4Node.cursor.reset();
		}
		return {passed: passed, failed: failed};
	}


	summarize(passedFailed) {
		let logger4Node = AllTests.logger4Node;
		const TEST_INPUT_OUTPUT = AllTests.TEST_INPUT_OUTPUT;
		logger4Node.log("-----------------------------------------------------------");
		var ok = passedFailed.failed.length == 0;
		if (ok)
			Logger4Node.cursor.green();
		logger4Node.log("# Passed: " +passedFailed.passed.length+ '/' +TEST_INPUT_OUTPUT.length+ " (" +Math.round(passedFailed.passed.length*100/TEST_INPUT_OUTPUT.length)+ "%)");
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

AllTests.defineReadOnlyProperty("TEST_INPUT_OUTPUT", [
	"Grouping test: no group name in console when no group name passed.", 
	"Error test with named Logger4Node with prefix skipped", 
	"Warn test with named Logger4Node",
	"Info test with named Logger4Node with timestamp",
	"Debug test with named Logger4Node with timestamp and with level conditional",
	"All test with Logger4Node with level indicator",
	"All test with Logger with timestamp & level indicator",
	"All test with Logger with timestamp",
	"All test with named Logger with timestamp, & level indicator: also testing level indicator being call-specific",
	"Trace test with named Logger with level conditional"
	]
);
let allTests = new AllTests();
let passedFailed = allTests.testLogger();
allTests.summarize(passedFailed);

