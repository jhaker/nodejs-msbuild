
function config(_configuration){
	this.os						='windows';
	this.processor 			='x86';
	this.version				= '4.0';
	this.solutionName 		= 'mock';
	this.solutionPath 		= process.cwd() + '/mockFiles/';
	this.projectName 		= 'mock';
	this.projectPath 		= process.cwd() + '/mockFiles/mockSolution/mockProject/';
	this.targetFramework 	= '4.0';
	this.publishProfile		= '';
	this.configuration 		= _configuration;
}
config.prototype.packageOutputPath = function(){ return this.solutionPath  + this.publishProfile;}

module.exports = config;
