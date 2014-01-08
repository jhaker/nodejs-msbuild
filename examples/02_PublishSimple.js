var msbuild = require('../msbuild');

/*  configure */
/*  min configuration required */
msbuild.config('configuration','prd_release_configuration');
msbuild.config('publishProfile','server_01_publishProfile');


/* call publish as the last step */
msbuild.publish();