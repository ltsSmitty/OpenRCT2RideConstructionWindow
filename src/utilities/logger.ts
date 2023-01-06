// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/duktape.d.ts" />
/* istanbul ignore file */

import * as Environment from "../environment";


/**
 * The available levels of logging.
 */
type LogLevel = "debug" | "warning" | "error";


/**
 * Returns true if Duktape is available, or false if not.
 */
const isDuktapeAvailable = (typeof Duktape !== "undefined");


/**
 * Prints a message with the specified logging and plugin identifier.
 */
function print(_level: LogLevel, message: string): void {
	console.log(`${message}`);
}


/**
 * Returns the current call stack as a string.
 */
function stacktrace(): string {
	if (!isDuktapeAvailable) {
		return "  (stacktrace unavailable)\r\n";
	}

	const depth = -4; // skips act(), stacktrace() and the calling method.
	let entry: DukStackEntry, result = "";

	for (let i = depth; (entry = Duktape.act(i)); i--) {
		const functionName = entry.function.name;
		const prettyName = functionName
			? (`${functionName}()`)
			: "<anonymous>";

		result += `   -> ${prettyName}: line ${entry.lineNumber}\r\n`;
	}
	return result;
}


/**
 * Enable stack-traces on errors in development mode.
 */
if (Environment.isDevelopment && isDuktapeAvailable) {
	Duktape.errCreate = function onError(error): Error {
		error.message += (`\r\n${stacktrace()}`);
		return error;
	};
}


/**
 * Prints a debug message if the plugin is run in development mode.
 */
export function debug(message: string, emphasize = false): void {
	if (Environment.isDevelopment) {
		if (!emphasize) return print("debug", message);

		return print("debug",
			`-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_


		${message}


		-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`);
	}
}



/**
 * Prints a warning message to the console.
 */
export function warning(message: string): void {
	print("warning", message);
}


/**
 * Prints an error message to the console and an additional stacktrace
 * if the plugin is run in development mode.
 */
export function error(message: string): void {
	if (Environment.isDevelopment) {
		message += (`\r\n${stacktrace()}`);
	}
	print("error", message);
}


/**
 * Prints an error message to the console and an additional stacktrace
 * if the assert fails and the plugin is run in development mode.
 */
export function assert(condition: boolean, message: string): void {
	if (Environment.isDevelopment && !condition) {
		throw Error(`Assertion failed! ${message}`);
	}
	return <never>0;
}
