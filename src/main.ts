import { WindowTemplate } from "openrct2-flexui";
import { initCustomSprites } from "./objects/customSprites/customButtonSprites";
import { GlobalStateController } from "./objects/global/GlobalStateController";
import { trackIteratorWindow } from "./ui/ConstructionWindow";

/**
 * Opens the ride editor window.
 */
function openEditorWindow(window: WindowTemplate): void {
    // Check if game is up-to-date...
    if (context.apiVersion < 59) {
        // 59 => https://github.com/OpenRCT2/OpenRCT2/pull/17821
        const title = "Please update the game!";
        const message = "The version of OpenRCT2 you are currently playing is too old for this plugin.";

        ui.showError(title, message);
        console.log(`[TrackGenerator] ${title} ${message}`);
        return;
    }

    window.open();
}


/**
 * Entry point of the plugin.
 */
export default function main(): void {
    // if (!Environment.isUiAvailable) {
    //     console.log("UI unavailable, plugin disabled.");
    //     return;
    // }

    // initActions();
    initCustomSprites();

    const globalState: GlobalStateController = new GlobalStateController();
    const window = trackIteratorWindow(globalState);
    ui.registerMenuItem("Track Generator", () => openEditorWindow(window));
}
