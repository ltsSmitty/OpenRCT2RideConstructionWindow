import { debug } from "src/utilities/logger";
import { GlobalStateController } from "../../global/GlobalStateController";

const iterateSelection = (direction: "next" | "previous", globalState: GlobalStateController): boolean => {
    globalState.buildDirection.set(direction);
    debug(`Moving toward ${direction}`);
    const actionResponse = globalState.segmentModel.segmentState.iterateSelectionInDirection(direction);
    return actionResponse;
}

export default iterateSelection;
