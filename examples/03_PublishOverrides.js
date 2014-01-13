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



/*  configure */
	// min configuration required
		msbuild.config('configuration','myconfiguration');
		msbuild.config('publishProfile','mypublishprofile');
	// additional configuration 
		msbuild.config('processor','x86');
		msbuild.config('version','2.0');
		var overrideParams = [];
		overrideParams.push('/tv:4.0');   // target framework 4.0
		msbuild.config('overrideParams',overrideParams);

		
// call publish as the last step
msbuild.publish();
