/**
 * Prints a debug message if the plugin is run in development mode.
 */
export function debug(message: string, emphasize = false): void {
	if (!emphasize) return console.log("debug", message);
	return console.log("debug",
		`-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_


		${message}


		-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`);
}
