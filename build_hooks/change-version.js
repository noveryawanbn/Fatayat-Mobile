/*jslint es6, node:true */
"use strict";

const commandLineArgs = require('command-line-args');
const xml2js = require('xml2js');
const fs = require('fs');
const cordovaConfig = require('cordova-config');

function run() {
  console.log("Changing version");
  const optionDefinitions = [{
    name: 'version',
    type: Number
  }];

  // getting command line args
  const args = commandLineArgs(optionDefinitions, {
    partial: true
  });
  if (!args.version) {
    console.error("Version is not provided");
    return;
  }

  const configFilePath = __dirname + "/../config.xml"

  // change version in file
  const parser = new xml2js.Parser();
  fs.readFile(configFilePath, (err, data) => {
    parser.parseString(data, (err, result) => {
      if (err) {
        console.error("parse error:\n" + err);
        return;
      }
      const androidCode = args.version;
      const version = _getVersion(result.widget.$.version, androidCode);
      console.log(`buildNumber: ${ androidCode }, version: ${version}`)
      _saveChanges(configFilePath, version, androidCode);
      console.log("Changes saved");
    })
  });
}

function _getVersion(fileVersion, buildNumber) {
  const index = fileVersion.lastIndexOf(".");
  const version = index < 0 ? fileVersion : fileVersion.substring(0, fileVersion.lastIndexOf(".") + 1);
  return "" + version + buildNumber;
}

function _saveChanges(filePath, version, androidVersion) {
  const config = new cordovaConfig(filePath);
  config.setVersion(version);
  config.setAndroidVersionCode(androidVersion)

  config.writeSync();
}

run();