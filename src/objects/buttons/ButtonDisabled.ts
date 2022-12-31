import { Store, store } from "openrct2-flexui";
import { GlobalStateController } from "../global/GlobalStateController";

// handle all of the logic for disabling buttons
export const shouldThisButtonBeDisabled = ({ buttonType, globalState }: { buttonType: BuildWindowButton, globalState: GlobalStateController }): Store<boolean> => {
    return store<boolean>(false);
}
