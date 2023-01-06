import { GlobalStateController } from './../../global/GlobalStateController';
import { debug } from "src/utilities/logger";
import { toggleXYZPicker } from "src/services/pickSegment";
import * as finder from "src/services/finder";

const selectSegment = (globalState: GlobalStateController, isPressed: boolean): Segment | null => {
    if (isPressed) { // don't go through this when the toggle turns off.

        const { buttonState, segmentModel } = globalState;
        const { segmentState, trackElementsOnSelectedTile } = segmentModel;

        buttonState.updateControl({ button: 'select', isPressed: 'pressed' });

        // open the picker tool
        toggleXYZPicker(isPressed,
            (coords) => {
                // get all the track elements on the selected tile
                const elementsOnCoords = finder.getTrackElementsFromCoords(coords);
                trackElementsOnSelectedTile.set(elementsOnCoords);
                // if there's at least one, set that as the selected segment
                if (trackElementsOnSelectedTile.get().length > 0) {
                    // set the segment state relative to the first one found.
                    segmentState.updateSegmentSequence(trackElementsOnSelectedTile.get()[0].segment);
                }
            },
            () => {
                debug(`selection finished`);
                globalState.buttonState.updateControl({ button: 'select', isPressed: "notPressed" });
            });
    }
    return globalState.segmentModel.segmentState.selectedSegment.get();
};

export default selectSegment;
