//gulp
var gulp = require('gulp');

// plugins
var s3 = require("gulp-s3");
var AWS = require('aws-sdk');
var sonarqubeScanner = require('sonarqube-scanner');
var cloudfront = require('gulp-cloudfront-invalidate');
var del = require('del');

function gets3CredentialsQA(bucket) {
  return {
    "key": process.env.AWS_ACCESS_KEY_ID_DEVELOP,
    "secret": process.env.AWS_SECRET_ACCESS_KEY_DEVELOP,
    "bucket": bucket,
    "region": "us-east-1"
  }
}

var s3CredentialsStaging = {
  "key": process.env.AWS_ACCESS_KEY_ID_STAGE,
  "secret": process.env.AWS_SECRET_ACCESS_KEY_STAGE,
  "bucket": "virtualstaging.bancodebogota.com.co",
  "region": "us-east-1"
};

//s3CredentialsNewProd
var s3CredentialsProd = {
  "key": process.env.AWS_ACCESS_KEY_ID_PROD_PB,
  "secret": process.env.AWS_SECRET_ACCESS_KEY_PROD_PB,
  "bucket": "bdb-prod-pb-bancavirtual",
  "region": "us-east-1"
};

function getSettingsQa(cloudfrontId) {
  return {
    "distribution": cloudfrontId, // Cloudfront distribution ID
    "paths": ['/*'],          // Paths to invalidate
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID_DEVELOP,             // AWS Access Key ID
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY_DEVELOP,         // AWS Secret Access Key
    "wait": true,                      // Whether to wait until invalidation is completed (default: false)
    "region": "us-east-1"
  }
}
// settings CloudfrontQa
var settingsQa = {
  "distribution": 'E3ER16HJ4ZZ1JG', // Cloudfront distribution ID
  "paths": ['/*'],          // Paths to invalidate
  "accessKeyId": process.env.AWS_ACCESS_KEY_ID_DEVELOP,             // AWS Access Key ID
  "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY_DEVELOP,         // AWS Secret Access Key
  "wait": true,                      // Whether to wait until invalidation is completed (default: false)
  "region": "us-east-1"
};

// settings CloudfrontStaging
var settingsStaging = {
  "distribution": 'E1IRDCT45JRBIS', // Cloudfront distribution ID
  "paths": ['/*'],          // Paths to invalidate
  "accessKeyId": process.env.AWS_ACCESS_KEY_ID_STAGE,             // AWS Access Key ID
  "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY_STAGE,         // AWS Secret Access Key
  "wait": true,                      // Whether to wait until invalidation is completed (default: false)
  "region": "us-east-1"
};

//taskQA
gulp.task('deployQA', function () {
  gulp.src('./www/**').pipe(AWS.s3(gets3CredentialsQA("bdb-qa-virtual-web")));
});

//taskBV
gulp.task('deployBV', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV2', async function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-2");
  return gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV3', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-3");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV4', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-4");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV5', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-5");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV6', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-6");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV7', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-7-tm");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV8', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-8-tm");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskQA
gulp.task('deployBV9', function () {
  //gulp.src('./platforms/browser/www/**').pipe(s3(s3CredentialsQA));
  var credentials = gets3CredentialsQA("barto-virtual-9-tm");
  gulp.src('./www/**').pipe(s3(credentials));
});

//taskStaging
gulp.task('deployStaging', function () {
  gulp.src('./www/**').pipe(s3(s3CredentialsStaging));
});

//taskNewProd
gulp.task('deployProd', function () {
  gulp.src('./www/**').pipe(s3(s3CredentialsNewProd));
});

//sonar2
gulp.task('sonar', function(callback) {
  sonarqubeScanner({
      serverUrl: process.env.SONAR_CLOUD_ENDPOINT,
      token: process.env.SONAR_CLOUD_TOKEN,
      options: {
          'sonar.projectName': process.env.SONAR_CLOUD_PROJECT_NAME,
          'sonar.login': process.env.SONAR_CLOUD_TOKEN,
          'sonar.organization': process.env.SONAR_CLOUD_ORG,
          'sonar.projectKey': process.env.SONAR_CLOUD_PROJECT_KEY,
          'sonar.branch.name': 'master',
          'sonar.language': 'ts',
          'sonar.sources': 'src',
          'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
      }
  }, callback);
});

//cloudfrontQa
gulp.task('invalidateCacheQa', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E3ER16HJ4ZZ1JG')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E2JISPQXW0Z9DO')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV2', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E3WT0EHZXJT0G')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV3', function () {
  return gulp.src('*')
  .pipe(cloudfront(getSettingsQa('E1P11X7CFMLU29')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV4', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E282JILPC62279')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV5', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E29R71LFCB27H9')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV6', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E2OKWOWIQ1X71R')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV7', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E2TN2YTLIFNPAI')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV8', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E6NCZIOF8J1LK')));
});

//cloudfrontQa
gulp.task('invalidateCacheBV9', function () {
  return gulp.src('*')
    .pipe(cloudfront(getSettingsQa('E1BML1HUWLXLRM')));
});

//cloudfrontStaging
gulp.task('invalidateCacheStaging', function () {
  return gulp.src('*')
    .pipe(cloudfront(settingsStaging));
});

gulp.task('clean:bucket', function () {
  return del('*');
});