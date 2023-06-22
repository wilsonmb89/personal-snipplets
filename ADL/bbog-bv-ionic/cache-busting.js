#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio'),
    revHash = require('rev-hash');

var packageJson = require('./package.json');
var rootDir = path.resolve(__dirname, './');
var wwwRootDir = path.resolve(rootDir, 'www');
var buildDir = path.join(wwwRootDir, 'build');
var indexPath = path.join(wwwRootDir, 'index.html');
var swPath = path.join(wwwRootDir, 'bv_service-worker.js');
var versionFileName = path.join(wwwRootDir, 'assets/version.json');
var versionFile = require(versionFileName);

var cssPath = path.join(buildDir, 'main.css');
//var cssFileHash = revHash(fs.readFileSync(cssPath));
var cssNewFileName = `main.${packageJson.version}.css`;
var cssNewPath = path.join(buildDir, cssNewFileName);
var cssNewRelativePath = path.join('build', cssNewFileName);

var jsPath = path.join(buildDir, 'main.js');
//var jsFileHash = revHash(fs.readFileSync(jsPath));
var jsNewFileName = `main.${packageJson.version}.js`;
var jsNewPath = path.join(buildDir, jsNewFileName);
var jsNewRelativePath = path.join('build', jsNewFileName);

var jsVendorPath = path.join(buildDir, 'vendor.js');
//var jsVendorFileHash = revHash(fs.readFileSync(jsVendorPath));
var jsVendorNewFileName = `vendor.${packageJson.version}.js`;
var jsVendorNewPath = path.join(buildDir, jsVendorNewFileName);
var jsVendorNewRelativePath = path.join('build', jsVendorNewFileName);

// rename main.css to main.[hash].css
fs.renameSync(cssPath, cssNewPath);

// rename main.js to main.[hash].js
fs.renameSync(jsPath, jsNewPath);

// rename vendor.js to vendor.[hash].js
fs.renameSync(jsVendorPath, jsVendorNewPath);

// update index.html to load main.[hash].css
$ = cheerio.load(fs.readFileSync(indexPath, 'utf-8'));

$('head link[href="build/main.css"]').attr('href', cssNewRelativePath);
$('body script[src="build/main.js"]').attr('src', jsNewRelativePath);
$('body script[src="build/vendor.js"]').attr('src', jsVendorNewRelativePath);


fs.writeFileSync(indexPath, $.html());

fs.writeFileSync(indexPath, $.html());

fs.readFile(swPath, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result =
  data.replace(/main.js/g, `main.${packageJson.version}.js`);
  result = result.replace(/vendor.js/g, `vendor.${packageJson.version}.js`);
  result = result.replace(/main.css/g, `main.${packageJson.version}.css`);

  fs.writeFile(swPath, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});

// update version file
versionFile.version = `${packageJson.version}-M`;
    
fs.writeFile(versionFileName, JSON.stringify(versionFile), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(versionFile));
  console.log('writing to ' + versionFileName);
});
