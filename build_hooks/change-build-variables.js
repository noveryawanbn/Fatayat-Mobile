/*jslint esverion:6, node:true */
"use strict";

const cordovaConfig = require('cordova-config');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const path = require('path');

function run() {
    console.log('Changing app id and name');

    const configFilePath = path.join(__dirname, "/../config.xml");
    const config = new cordovaConfig(configFilePath);
    var id = "id.co.manulife.fatayat.dev";
    config.setID(id);
    console.log(`id : ${id}`);
    var name = "Fatayat Dev";
    config.setName(name);
    console.log(`id : ${name}`);
    console.log('completed.');

    config.writeSync();
};

run();