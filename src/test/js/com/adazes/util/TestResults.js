var TestResults = function(_passed, _failed) {
	let passed = _passed ? _passed : [];
	let failed = _failed ? _failed : [];

	this.getPassed = function() { return passed }
	this.getFailed = function() { return failed }
};
export default TestResults;
