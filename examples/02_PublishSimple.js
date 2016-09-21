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

/*  configure  */
	// min configuration required
msbuild.sourcePath = 'WebApplicationExamples/MvcExample/src/webexample1/webexample1.csproj';
msbuild.configuration='myconfiguration';
msbuild.publishProfile='mypublishprofile';

// call publish as the last step
msbuild.publish(); 