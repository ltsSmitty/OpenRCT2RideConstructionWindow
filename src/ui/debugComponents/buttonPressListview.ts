import { computeBuildLocation } from './../../services/computeBuildLocation';
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
            buttonState.getButtonPressCombinationStores().pitch,
            globalState.buildDirection, (curve, bank, pitch, direction) => {

                const initialBuildLocation = segmentState.getBuildLocation({ direction });
                const locationString = initialBuildLocation ? `${initialBuildLocation.x}, ${initialBuildLocation.y}, ${initialBuildLocation.z}; ${initialBuildLocation.direction}` : "No location";
                return [
                    `Curve: ${curve ?? "none"}`,
                    `Bank: ${bank ?? "none"}`,
                    `Pitch: ${pitch ?? "none"}`,
                    `Initial location: ${locationString}`
                ];
            })
    });
};

export default buttonPressListview;
