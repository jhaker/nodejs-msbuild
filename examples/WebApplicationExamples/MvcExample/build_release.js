var _msbuild = require('../../../msbuild');
var msbuild = new _msbuild(function(){});

msbuild.sourcePath = 'src/webexample1.sln';
msbuild.configuration = 'release';
msbuild.publishProfile = 'production';
msbuild.publish(); 