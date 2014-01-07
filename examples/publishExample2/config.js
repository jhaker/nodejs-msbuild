
function config(_configuration){
	this.solutionName 		= 'mock';
	this.solutionPath 		= process.cwd() + '/mockFiles/';
	this.projectName 		= 'mock';
	this.projectPath 		= process.cwd() + '/mockFiles/mockSolution/mockProject/';
	this.targetFramework 	= 'v4.0';
	this.publishProfile		= '';
	this.configuration 		= _configuration;
}
config.prototype.packageOutputPath = function(){ return this.solutionPath  + this.publishProfile;}

module.exports = config;
