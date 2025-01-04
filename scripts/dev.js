import { spawn } from 'child_process';
import { watch } from 'fs';
import { build } from './build.js';
import packageJson from '../package.json' with { type: 'json' };


let nodeProcess;
let debounceTimeouts = new Map();


function startNodeProcess()
{
	const cmd = packageJson.scripts.start.split(' ');
	const process = spawn(cmd.shift(), cmd, { stdio: 'inherit' });

	process.on('exit', code => {
		if (code !== null)
			console.log(`Waiting for change to restart...`);
	});

	return process;
}

async function dispatch(filename)
{
	console.clear();

	if (filename)
		console.log(`${filename} changed, rebuilding...`);

	if (nodeProcess)
		nodeProcess.kill();

	try
	{
		await build();
	}
	catch (error)
	{
		console.log(`Waiting for change to restart...`);
		return;
	}

	nodeProcess = startNodeProcess();
}

async function init()
{
	await dispatch();

	watch('src', { recursive: true }, (eventType, filename) => {
	
		if (!filename || eventType !== 'change')
			return;
	
		if (debounceTimeouts.has(filename))
			clearTimeout(debounceTimeouts.get(filename));
	
		debounceTimeouts.set(
			filename,
			setTimeout(() => {
				debounceTimeouts.delete(filename);
				dispatch(filename);
			}, 100)
		);

	});
}


init();
