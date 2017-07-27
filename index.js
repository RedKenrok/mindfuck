#! /usr/bin/env node
/*! Brainfuck.js, v0.0.0, https://github.com/RedKenrok/brainfucked-js, MIT License */

// Setup node.js' module.
let fileSystem = require('fs'),
	path = require('path'),
// Get the brainfuck interpreter from the libraries folder.
	brainfuck = module.exports = require('./lib/brainfuck');

// Add command function to the exports.
brainfuck.command = function(args) {
	args = require('minimist')(
		args,
		{
			alias: {
				c: 'code',
				e: 'error',
				h: 'help',
				m: 'memory',
				p: 'path',
				v: 'version'
			},
			unknown: function() {
				console.log('Unknown argument given, use -h for more information');
			}
		});
	
	// No arguments or help.
	if (args.length <= 0 || args.hasOwnProperty('h')) {
		console.log(
			'Usage:                          fitp [options]\n'
		  + 'Options:\n'
		  + '  -c "<code>", -code "<code>"   runs the given code\n'
		  + '  -e <bool>, -error <bool>      stop when encountering an error, default false\n'
		  + '  -h, -help                     command options\n'
		  + '  -m, -memory                   memory cell length, default 30000\n'
		  + '  -p <path>, -path <path>       runs using the the code from the file\n'
		  + '  -v, -version                  semantic version'
			);
	}
	
	// Version
	if (args.hasOwnProperty('v')) {
		console.log(
			'Version:                        ' + require('./package.json').version
			);
	}
	
	// Set the brainfuck options
	let options = {
		callbackInput: function(callback) {
			let input = function(data) {
				process.stdin.removeListener('data', input)
					.pause();
				callback(data.substring(0, 1));
			}
			process.stdin.setEncoding('ascii')
				.on('data', input)
				.resume();
		},
		callbackOutput: function(value) {
			process.stdout.write(value);
		},
		callbackComplete: function(error) {
			if (error) {
				console.error(error);
			}
		}
	}
	// Error
	if (args.hasOwnProperty('e')) {
		options.returnOnError = args.e;
	}
	// Memory
	if (args.hasOwnProperty('m')) {
		options.memoryLength = args.m;
	}
	// Load options in
	brainfuck(options);
	
	// Code
	if (args.hasOwnProperty('c')) {
		brainfuck.run(args.c);
	}
	// Path
	else if (args.hasOwnProperty('p')) {
		// Directory to build from exists.
		if (!fileSystem.existsSync(args.p)) {
			console.error('Invalid directory path, please make sure the file exists');
			return;
		}
		
		let buffer = '';
		fileSystem.createReadStream(args.p)
			.on(
				'data',
				function(data) {
					buffer += data;
				})
			.on(
				'end',
				function(error) {
					if (error) {
						console.error(error);
					}
					brainfuck.run(buffer);
				});
	}
}

brainfuck.command(process.argv.slice(2));
