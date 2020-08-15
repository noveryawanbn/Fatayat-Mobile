const fs = require('fs-extra');
const util = require("util");
const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);
const exec = require("child_process").exec;

async function readJsonFromFile(filePath){
	const data = await fsReadFile(filePath);
	const result = JSON.parse(data);
	return result;
}

async function saveJsonToFile(json, filePath) {
	await fsWriteFile(filePath, JSON.stringify(json, null, 2));
}

async function changeJsonInFile(filename, changeFunction) {
	let  json = await readJsonFromFile(filename);
	json = changeFunction(json);
	if (json == null) throw "changeFunction should return a value";
	await saveJsonToFile(json, filename);
}

function execCommandLine(command){
	const result = new Promise((resolve, reject) => {
		try {
			console.log(`Executing: ${command}`);
			const cmd = exec(command);
			cmd.stdout.on("data", (data) => console.log(data.toString()));
			cmd.stderr.on("data", (data) => console.error(data.toString()))
			cmd.on("exit", (data) => resolve("ok"));
		}
		catch (ex){
			reject(ex);
		}

	});

	return result;
}

// --------------------------------------------------------------------- //
exports.readJsonFromFile = readJsonFromFile;
exports.saveJsonToFile = saveJsonToFile;
exports.changeJsonInFile = changeJsonInFile;
exports.execCommandLine = execCommandLine;