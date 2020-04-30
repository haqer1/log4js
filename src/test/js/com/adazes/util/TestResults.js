var TestResults = function(_passed, _failed) {
	let passed = _passed ? _passed : [];
	let failed = _failed ? _failed : [];

	this.getPassed = function() { return passed }
	this.getFailed = function() { return failed }
	this.merge = function(testResults) {
		Array.prototype.push.apply(passed, testResults.getPassed());
		Array.prototype.push.apply(failed, testResults.getFailed());
	}
};
export default TestResults;
