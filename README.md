# Mindfuck
Mindfuck is a Brainfuck interperter usable as a [node.js](https://nodejs.org) module, a command-line tool, and as a web library.

## Node.js module
1. Install node.js and npm.js
	* See the [installation guide](https://docs.npmjs.com/getting-started/installing-node)
2. Run from your project folder
```
npm install mindfuck
```
2. Or add the following to your package.json
```
"dependencies": {
	"mindfuck": "0.x"
},
```
3. See the [Library section](#Library) for futher usage

## Command line
1. Install node.js and npm.js
	* See the [installation guide](https://docs.npmjs.com/getting-started/installing-node)
2. Run
```
npm install mindfuck -g
```

### Commands
```
Usage:                          fitp [options]
Options:
  -c "<code>", -code "<code>"   runs the given code
  -e <bool>, -error <bool>      stop when encountering an error, default false
  -h, -help                     command options
  -m, -memory                   memory cell length, default 30000
  -p <path>, -path <path>       runs using the the code from the file
  -v, -version                  semantic version
```

## Web
1. Copy the [brainfuck.js](libs/brainfuck.js) file from the [libs](libs/) folder
2. See the [Library section](#Library) for futher usage
3. See the example in the [example folder](example/)

## Library
### Functions
```
brainfuck
    Parameter(s): object options
	Parse options to the library, see options
brainfuck.run
	Parameter(s): string code
	Runs the given code
```

### Options
```
memoryLength
	Default: 30000
	Amount of cells in memory
returnOnError
	Default: false
	Stop when encountering an unknown operation
callbackInput
	Parameter(s): function callback
	Called when input required, call the callback with the input in order to continue the program
callbackOutput
	Parameter(s): char value
	Called when output operation encountered
callbackComplete
	Parameter(s): string error
	Called when program is finished, or an error has been encountered if returnOnError is true
```