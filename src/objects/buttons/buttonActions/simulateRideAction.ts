
import { SegmentState } from "../../segments/SegmentSequence";
import * as actions from "src/actions/actions";

const simulateRide = (segmentState: SegmentState, activate: boolean): void => {
    const thisRide = segmentState.selectedSegment.get()?.ride;
    return actions.simulateRide(thisRide || 0, activate);
};

export default simulateRide;
