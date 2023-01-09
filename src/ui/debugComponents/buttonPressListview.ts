import { WidgetCreator, FlexiblePosition, listview, compute } from "openrct2-flexui";
import { GlobalStateController } from "~/src/objects/global/GlobalStateController";

const buttonPressListview = (globalState: GlobalStateController): WidgetCreator<FlexiblePosition> => {

    const { buttonState, segmentModel, buildDirection } = globalState;
    const { segmentState } = segmentModel;
    // display stats for the selected segment
    return listview({
        height: 50,
        items: compute(
            buttonState.getButtonPressCombinationStores().curve,
            buttonState.getButtonPressCombinationStores().bank,
            buttonState.getButtonPressCombinationStores().pitch, (curve, bank, pitch) => {

                const initialBuildLocation = segmentState.getBuildLocation({ direction: buildDirection.get() });
                const locationString = initialBuildLocation ? `${initialBuildLocation.x}, ${initialBuildLocation.y}, ${initialBuildLocation.z}; ${initialBuildLocation.direction}` : "No location";
                return [
                    `Curve: ${curve ?? "none"}`,
                    `Bank: ${bank ?? "none"}`,
                    `Pitch: ${pitch ?? "none"}`,
                    `${locationString}`,
                ];
            })
    });
};

export default buttonPressListview;
