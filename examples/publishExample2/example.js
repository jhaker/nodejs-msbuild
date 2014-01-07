
/* running 
	>node example.js 
*/

var fs = require('fs'),
	msbuild = require('../../msbuild'),
	config = require('./config'),
	environment = 'mockEnvironment',
	profiles = ['mockPublishProfile'];


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
		setTimeout(publish(config,val),3000);
	}
);



 