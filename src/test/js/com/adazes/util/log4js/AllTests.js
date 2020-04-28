#!/usr/bin/env node
"use strict";

import Logger4Node from "../../../../../../main/js/com/adazes/util/log4js/Logger4Node.js";
import {Level/**/, Logger} from "../../../../../../main/js/com/adazes/util/log4js/Logger.js";
import ConsoleInterceptor from "./ConsoleInterceptor.js";

const WARNING_TEST_LOGGER_NAME = "WarningTest";
const INFO_TEST_LOGGER_NAME = "InfoTest";
const FULL_PREFIX_TEST_LOGGER_NAME = "FullPrefixTest";
const ALL_TESTS_LOGGER_NAME = "AllTests";
var logger4Node = new Logger4Node(ALL_TESTS_LOGGER_NAME, Level.INFO, true);
var logger4NodeWithName = new Logger4Node(WARNING_TEST_LOGGER_NAME, Level.INFO, false, true);
var logger4NodeWithNameWithTimeStamp = new Logger4Node(INFO_TEST_LOGGER_NAME, Level.INFO, false);
var logger4NodeWithLevelIndicator = new Logger4Node(ALL_TESTS_LOGGER_NAME, Level.ALL, false, true, true, true);
var loggerWithLevelIndicator = new Logger(ALL_TESTS_LOGGER_NAME, Level.ALL, false, false, true, true);
var loggerWithTimestamp = new Logger(ALL_TESTS_LOGGER_NAME, Level.DEBUG, false, false, true);
var loggerWithFullPrefix = new Logger(FULL_PREFIX_TEST_LOGGER_NAME, Level.DEBUG, false, false, false, true);
var logger = new Logger(ALL_TESTS_LOGGER_NAME, Level.INFO, true);

let consoleInterceptor = new ConsoleInterceptor();

var TEST_INPUT_OUTPUT = [
	"Error test with named Logger4Node with prefix skipped.", 
	"Warn test with named Logger4Node",
	"Info test with named Logger4Node with timestamp",
	"Debug test with named Logger4Node with timestamp and with level conditional",
	"All test with Logger4Node with level indicator",
	"All test with Logger with timestamp & level indicator",
	"All test with Logger with timestamp",
	"All test with named Logger with timestamp, & level indicator",
	"Trace test with named Logger with level conditional"
	]
;

var passed = [];
var failed = [];

const LOG_MD_ON_SAME_LINE_AS_ERRORED_TEST_INDEX = false;
for (var i = 0; i < TEST_INPUT_OUTPUT.length; i++) {
	var input = TEST_INPUT_OUTPUT[i];
	let fn;
	let expected, expectedPattern;
	let timestampPatternStr = "\\d{4}-\\d{1,2}-\\d{1,2},? (.* )?\\d{2}:\\d{2}:\\d{2}";
	let regexBasedTest = i == 2 || i == 5 || i == 6 || i == 7;
	switch(i) {
	case 0:
		logger4Node.error(input);
		expected = input;
		break;
	case 1:
		logger4NodeWithName.warn(input);
		expected = WARNING_TEST_LOGGER_NAME+ ": " +input;
		break;
	case 2:
		logger4NodeWithNameWithTimeStamp.info(input);
		expectedPattern = new RegExp(INFO_TEST_LOGGER_NAME+ " \\(" +timestampPatternStr+ "\\): " +input);
		break;
	case 3:
		if (logger4NodeWithNameWithTimeStamp.isDebugEnabled())
			logger4Node.debug(input);
		expected = null;
		break;
	case 4:
		logger4NodeWithLevelIndicator.all(input);
		expected = "A> " +input;
		break;
	case 5:
		loggerWithLevelIndicator.all(input);
		expectedPattern = new RegExp("A> " +timestampPatternStr+ ": " +input);
		break;
	case 6:
		loggerWithTimestamp.debug(input);
		expectedPattern = new RegExp('^' +timestampPatternStr+ ": " +input);
		break;
	case 7:
		if (loggerWithFullPrefix.isDebugEnabled())
			loggerWithFullPrefix.debug(input);
		expectedPattern = new RegExp("^D> " +FULL_PREFIX_TEST_LOGGER_NAME+ " \\(" +timestampPatternStr+ "\\): " +input);
		break;
	case 8:
		if (logger.isTraceEnabled())
			logger.trace(input);
		expected = null;
		break;
	}
	let output = consoleInterceptor.getLastMessage();
	if ((!regexBasedTest && output == expected) || (regexBasedTest && expectedPattern.test(output))) {
		passed.push(i);
		if (i == 3 || i == 8)
			logger4Node.debug("no message for " +(i == 3 ? "DEBUG" : "TRACE") + " on INFO logger for: " +input);
		Logger4Node.cursor.green().write("✓ \n");
	} else {
		let f = {i: i, input: input, expected: !regexBasedTest ? expected : expectedPattern, output: output};
		failed.push(f);
		Logger4Node.cursor.red().write("✘ ");
		logger4Node.warn("\t=== expected: ===");
		logger4Node.warn(f.expected);
		logger4Node.warn("\t=== output: ===");
		logger4Node.warn(f.output);
//		logger4Node.log(input);
	}
	Logger4Node.cursor.reset();
}

logger4Node.log("-----------------------------------------------------------");
var ok = failed.length == 0;
if (ok)
	Logger4Node.cursor.green();
logger4Node.log("# Passed: " +passed.length+ '/' +TEST_INPUT_OUTPUT.length+ " (" +Math.round(passed.length*100/TEST_INPUT_OUTPUT.length)+ "%)");
