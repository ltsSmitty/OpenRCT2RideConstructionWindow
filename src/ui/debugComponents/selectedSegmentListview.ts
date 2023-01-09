import { WidgetCreator, FlexiblePosition, listview, compute } from "openrct2-flexui";
import { GlobalStateController } from "~/src/objects/global/GlobalStateController";
import { TrackElementType } from "~/src/utilities/trackElementType";

const selectedSegmentListview = (globalState: GlobalStateController): WidgetCreator<FlexiblePosition> => {

    const { selectedSegment } = globalState.segmentModel.segmentState;

    return listview({
        height: 50,
        items: compute(selectedSegment, (segment) => {
            const trackElementTypeString = segment ? TrackElementType[segment.trackType] : "none";
            const locationString = segment?.location ? `${segment.location.x}, ${segment.location.y}, ${segment.location.z}; ${segment.location.direction}` : "No location";

            return [
                `Ride: ${segment?.ride ?? "none"}`,
                `Ride type: ${segment?.rideType ?? "none"}`,
                `Track element type:  ${trackElementTypeString}`,
                `Location: ${locationString}`,
            ];
        })
    });
};

export default selectedSegmentListview;
