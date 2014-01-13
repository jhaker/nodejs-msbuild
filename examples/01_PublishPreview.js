var msbuild = require('../msbuild');

msbuild.config('configuration','myconfiguration');
msbuild.config('publishProfile','mypublishprofile');
msbuild.config('processor','x64');
msbuild.config('version','4.5');
msbuild.config('targetFramework','4.0');


msbuild.exec  = function(cmd){
	
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	console.log(cmd);
	console.log('********** test - end  ************\n');
}
msbuild.publish();