/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { GlobalStateController } from './../global/GlobalStateController';
import * as assertButton from "./ButtonAssertions";
import buttonActions from './buttonActions';
import { debug } from '../../utilities/logger';

export const onButtonChange = (params: {
    buttonType: BuildWindowButton,
    pressState: ButtonPressOption,
    globalState: GlobalStateController,
}): void => {
    const { buttonType, pressState, globalState } = params;
    // debug(`the global state is ${globalState.buildDirection.get()}`);
    const { buttonState, segmentModel, buildState } = globalState;

    // If curve button was updated
    if (assertButton.isCurveButton(buttonType)) {
        buttonState.updateCurve({ button: buttonType, isPressed: pressState });

    }

    // If bank button was updated
    if (assertButton.isBankButton(buttonType)) {
        buttonState.updateBank({ button: buttonType, isPressed: pressState });
    }

    // If slope button was updated
    if (assertButton.isPitchButton(buttonType)) {
        buttonState.updatePitch({ button: buttonType, isPressed: pressState });
    }

    switch (buttonType) {
        // action: iterate track along selected direction
        case "iterateNext":
        case "iteratePrevious": {
            const direction = buttonType === "iterateNext" ? "next" : "previous";
            buttonActions.iterateSelection({ direction, globalState });
            break;
        }

        // action: start simulation
        case "simulate": {
            debug(`pressState: ${pressState}`);
            buttonActions.simulateRide(segmentModel.segmentState, pressState === "pressed" ? true : false);
            break;
        }

        // action: select segment
        case "select": {
            buttonActions.selectSegment(globalState, pressState === "pressed" ? true : false);
            break;
        }

        // action: build selectedBuild
        case "build": {
            // modelResponse = buildSegment(model);
            break;
        }

        // action: destroy segment
        // action: place entrance/exit


        // action: change selected build


        // details
        case "chainLift": {
            // loop through all the elements of this segment and set "hasChainLift" to true
            break;
        }
        case "boosters": {
            buildState.trackElementType.set(100); // "Booster" = 100,
            break;
        }
        case "camera": {
            buildState.trackElementType.set(114); //  "OnRidePhoto" = 114,
            break;
        }
        case "brakes": {
            buildState.trackElementType.set(99); //      "Brakes" = 99,
            break;
        }
        case "blockBrakes": {
            buildState.trackElementType.set(216); //   "BlockBrakes" = 216,
            break;
        }
    }
    debug(`What pieces could be built given the currently pressed buttons?`);

    // const pitchButton = buttonModel.selectedPitch.get();
    // const bankButton = buttonModel.selectedBank.get();
    // const curveButton = buttonModel.selectedCurve.get();
    // const specialButton = buttonModel.selectedSpecial.get();
    // const miscButton = buttonModel.selectedMisc.get();
    // const detailButtons = buttonModel.selectedDetails.get();

    // // todo also compare whether the button is enabled before saying that it's active.
    // const pitchButtonActive = (pitchButton !== null ? pitchButton : undefined);
    // const bankButtonActive = (bankButton !== null ? bankButton : undefined);
    // const curveButtonActive = (curveButton !== null ? curveButton : undefined);
    // const specialButtonActive = (specialButton !== null ? specialButton : undefined);
    // const miscButtonActive = (miscButton !== null ? miscButton : undefined);
    // const detailButtonsActive = (detailButtons !== null ? detailButtons : [] as DetailButton[]);


    // const selectedElements: ButtonsActivelyPressed = {
    //     curve: curveButtonActive,
    //     bank: bankButtonActive,
    //     pitch: pitchButtonActive,
    //     special: specialButtonActive,
    //     misc: miscButtonActive,
    //     detail: detailButtonsActive,
    // };

    // todo this seems important and is missing
    // model.trackTypeSelector.updateButtonsPushed(selectedElements);
    // model.buildableTrackByButtons.set(newBuildableTrackTypes);

    // todo i think this could maybe move into the button model, or make it more robust here
    // model.debugButtonChange({ buttonType, pressState, modelResponse });


};
