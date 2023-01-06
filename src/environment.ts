// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="environment.d.ts" />


/**
 * Returns the current version of the plugin.
 */
export const pluginVersion = "1.2";


/**
 * Returns the build configuration of the plugin.
 */
// export const buildConfiguration: BuildConfiguration = __BUILD_CONFIGURATION__
export const buildConfiguration: BuildConfiguration = "development";


/**
 * Returns true if the current build is a production build.
 */
export const isProduction = false; //(buildConfiguration === "production");


/**
 * Returns true if the current build is a production build.
 */
export const isDevelopment = (buildConfiguration === "development");


/**
 * Returns true if the UI is available, or false if the game is running in headless mode.
 */
export const isUiAvailable = (typeof ui !== "undefined");
