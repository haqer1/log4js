var TestFailure = function(input, expected, actual, index) {
	this.getInput = function() { return input }
	this.getExpected = function() { return expected }
	this.getActual = function() { return actual }
	this.getIndex = function() { return index }
};
export default TestFailure;
