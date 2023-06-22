var chalk = require("chalk");
var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
var PACKAGE = require('../package.json');
//var env = process.env.IONIC_ENV;
var env = process.env.BV_ENV;

/*
useDefaultConfig.prod.resolve.alias = {
  "@app/env": path.resolve(environmentPath('prod'))
};

useDefaultConfig.dev.resolve.alias = {
  "@app/env": path.resolve(environmentPath('dev'))
};


if (env !== 'prod' && env !== 'dev') {
  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@app/env": path.resolve(environmentPath(env))
  };
}
*/


useDefaultConfig[env] = useDefaultConfig.dev;
useDefaultConfig[env].resolve.alias = {
  "@app/env": path.resolve(environmentPath(env)),
  "@app/service-api": path.resolve('./src/new-app/core/services-apis/'),
  "@app/shared": path.resolve('./src/new-app/shared/'),
  "@app/delegate": path.resolve('./src/new-app/core/services-delegate/'),
  "@app/apis": path.resolve("./src/new-app/core/services-apis"),
  "@app/modules": path.resolve('./src/new-app/modules/'),
};

useDefaultConfig[env].output['chunkFilename'] = `[name].${PACKAGE.version}.[chunkhash].chunk.js`;

console.log('version -----> ', PACKAGE.version);
function environmentPath(env) {
  console.log('modo->', env);
  var filePath = './src/environments/environment' + ((env === 'prod' || env === undefined) ? '' : '.' + env) + '.ts';
  console.log('********ENVIRONMENT********');
  console.log(filePath);
  console.log('********ENVIRONMENT********');
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}


module.exports = function () {
  return useDefaultConfig;
};
