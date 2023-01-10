import { debug } from "src/utilities/logger";
import { GlobalStateController } from "../../global/GlobalStateController";

const iterateSelection = ({ direction, globalState }: { direction: BuildDirection, globalState: GlobalStateController }): boolean => {
    globalState.buildDirection.set(direction);
    debug(`Moving toward ${direction}`);
    const actionResponse = globalState.segmentModel.segmentState.iterateSelectionInDirection(direction);
    return actionResponse;
};

export default iterateSelection;
