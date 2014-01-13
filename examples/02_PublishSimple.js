var msbuild = require('../msbuild');

/*  configure */
/*  min configuration required */
msbuild.config('configuration','myconfiguration');
msbuild.config('publishProfile','mypublishprofile');


/* call publish as the last step */
msbuild.publish();