/*! Brainfuck.js, v0.0.0, https://github.com/RedKenrok/brainfuck.js, MIT License */

(function() {
	
	'use strict';
	
	let memory,			// 8-bit unsigned interger array of memory data
		memoryIndex,	// Index in memory data
		code,			// Character array of code to be executed
		codeIndex,		// Index in code data
		loopIndices;
	
	let brainfuck = function(options) {
		// Sets options
		for(let property in options) {
			brainfuck.options[property] = options[property];
		}
	}
	
	brainfuck.options = {
		memoryLength: 30000,
		returnOnError: false
	}
	
	brainfuck.run = function(_code) {
		// Checks if valid code entry
		if (_code.length == 0) {
			return false;
		}
		// Initialize all variables
		memory = new Uint8Array(brainfuck.options.memoryLength);
		memoryIndex = 0;
		code = _code;
		codeIndex = 0;
		loopIndices = [];
		
		itterate();
	}
	
	function itterate() {
		let operation = code[codeIndex];
		switch(operation) {
			case '>': // Next memory cell
				if (memoryIndex >= 0) {
					memoryIndex = ++memoryIndex % brainfuck.options.memoryLength;
				}
				break;
			case '<': // Previous memory cell
				if (memoryIndex > 0) {
					memoryIndex--;
				}
				break;
			case '+': // Increment value of selected memory cell
				memory[memoryIndex] = ++memory[memoryIndex] % 256;
				break;
			case '-': // Decrement value of selected memory cell
				if (memory[memoryIndex] > 0) {
					memory[memoryIndex]--;
				}
				break;
			case '.': // Give current memory cell value as ASCII character to the output callback
				if (brainfuck.options.callbackOutput) {
					brainfuck.options.callbackOutput(String.fromCharCode(memory[memoryIndex]));
				}
				break;
			case ',': // Request new input data and write it to the selected memory cell
				if (brainfuck.options.callbackInput) {
					brainfuck.options.callbackInput(
						function(value) {
							memory[memoryIndex] = value.charCodeAt(0) % 256;
							itterate();
						});
					return;
				}
				break;
			case '[': // Start a loop
				// If memory cell at index is not 0 then go through the loop
				if (memory[memoryIndex] != 0) {
					loopIndices.push(codeIndex);
					break;
				}
				// Otherwise go to the end of the loop
				let loopsOpenedCount = 0;
				do {
					if (codeIndex++ <= code.length) {
						operation = code[codeIndex];
						switch(characterTemp) {
							case '>':
							case '<':
							case '+':
							case '-':
							case '.':
							case ',': // Unintresting operation encountered
								break;
							case '[': // Loop opened
								loopsOpenedCount++;
								break;
							case ']': // Loop closed
								loopsOpenedCount--;
								break;
							default: // Invalid operation encountered
								if (brainfuck.options.returnOnError) {
									if (brainfuck.options.callbackComplete) {
										brainfuck.options.callbackComplete('Invalid operation encountered: ' + operation + ' at ' + codeIndex);
									}
									return;
								}
								break;
						}
					}
					else if (brainfuck.options.callbackComplete) {
						brainfuck.options.callbackComplete();
					}
				} while(loopsOpenedCount >= 0);
				break;
			case ']': // End a loop
				// If memory cell at index is 0 then forget the loop start index
				if (memory[memoryIndex] == 0) {
					loopIndices.pop();
					break;
				}
				// Else go back to the loop start
				codeIndex = loopIndices[loopIndices.length - 1];
				break;
			default: // Invalid operation encountered
				if (brainfuck.options.returnOnError) {
					if (brainfuck.options.callbackComplete) {
						brainfuck.options.callbackComplete('Invalid operation encountered: ' + operation + ' at ' + codeIndex);
					}
					return;
				}
				break;
		}
		
		// If end of code not reached itterate again
		if (codeIndex++ < code.length - 1) {
			// Increment the code index
			itterate();
		}
		// If end reached and complete callback given call it
		else if (brainfuck.options.callbackComplete) {
			brainfuck.options.callbackComplete(null);
		}
	}
	
	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = brainfuck;
	} else if (typeof define === 'function' && define.amd) {
		define(
			function() {
				return brainfuck;
			});
	} else {
		this.brainfuck = brainfuck;
	}
}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());