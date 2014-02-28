var _msbuild = require('../msbuild');
var msbuild = new _msbuild(function(){});


// TEST SETUP
	/* overriding publish for testing purposes */
	/* start - comment out */
	msbuild.exec  = function(cmd){
		
		console.log('\nTEST 1: Preview MSBUILD Command');
		console.log('********** test - start ************');
		console.log(cmd);
		console.log('********** test - end  ************\n');
	}
/* end setup */

msbuild.configuration='myconfiguration';
msbuild.publishProfile='mypublishprofile';
msbuild.outputPath='c:/mypackages/mypackagename';
msbuild.package();