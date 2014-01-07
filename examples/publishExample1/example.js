
/* running 
	>node example.js mockEnvironment mockPublishProfile
*/
var fs = require('fs'),
	msbuild = require('../../msbuild');
	

	/* config */
function mockApp(_configuration){
	this.solutionName 		= 'mock';
	this.solutionPath 		= process.cwd() + '/mockFiles/';
	this.projectName 		= 'mock';
	this.projectPath 		= process.cwd() + '/mockFiles/mockSolution/mockProject/';
	this.targetFramework 	= 'v4.0';
	this.publishProfile		= '';
	this.configuration 		= _configuration;
}
mockApp.prototype.packageOutputPath = function(){ return this.solutionPath  + this.publishProfile;}


	/* parameters passed from command line */
var args = process.argv;
var environment = args.splice(2,1);
var profiles = args.splice(2);


var publish = function(_base,_publishProfile){
	function serverConfiguration(){ };
	serverConfiguration.prototype = new _base(environment);
	serverConfiguration.prototype.publishProfile = _publishProfile;
	var serverConfigurationInstance = new serverConfiguration();
	msbuild.setConfig(serverConfigurationInstance); 
	msbuild.test();	
};


	/* process each publish profile */
profiles.forEach(function(val){
		console.log('PUBLISHING ' + val);
		setTimeout(publish(mockApp,val),3000);
	}
);



 