var msbuild = require('../msbuild');


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




msbuild.config('configuration','myconfiguration');
msbuild.config('publishProfile','mypublishprofile');
msbuild.config('outputPath','c:/mypackages/mypackagename');

msbuild.package();