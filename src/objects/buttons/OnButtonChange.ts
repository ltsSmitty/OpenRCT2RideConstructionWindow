/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { GlobalStateController } from './../global/GlobalStateController';
import * as assertButton from "./ButtonAssertions";
import buttonActions from './buttonActions';

import { debug } from '../../utilities/logger';
import { ButtonsActivelyPressed } from 'src/objects/buttons/ButtonMap';

export const onButtonChange = (options: {
    buttonType: BuildWindowButton,
    pressState: ButtonPressOption,
    globalState: GlobalStateController,
}): void => {
    const { buttonType, pressState, globalState } = options;
    // debug(`the global state is ${globalState.buildDirection.get()}`);



    let modelResponse;

    // If curve button was updated
    if (assertButton.isCurveButton(buttonType)) {
        buttonModel.selectedCurve.set(null);
        modelResponse = buttonModel.selectedCurve.set(buttonType);
    }

    // If bank button was updated
    if (assertButton.isBankButton(buttonType)) {
        buttonModel.selectedBank.set(null);
        modelResponse = buttonModel.selectedBank.set(buttonType);
    }

    // If slope button was updated
    if (assertButton.isPitchButton(buttonType)) {
        buttonModel.selectedPitch.set(null);
        modelResponse = buttonModel.selectedPitch.set(buttonType);
    }

    switch (buttonType) {
        // action: iterate track along selected direction
        case "iterateNext":
        case "iteratePrevious": {
            const direction = buttonType === "iterateNext" ? "next" : "previous";
            modelResponse = iterateSelection(direction, model);
            break;
        }

        // action: start simulation
        case "simulate": {
            debug(`isPressed: ${isPressed}`);
            modelResponse = simulateRide(model, isPressed);
            break;
        }

        // action: select segment
        case "select": {
            modelResponse = selectSegment(model, buttonModel, isPressed);
            break;
        }

        // action: build selectedBuild
        case "build": {
            modelResponse = buildSegment(model);
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
            modelResponse = model.updateSelectedBuild("trackType", 100);
            break;
        }
        case "camera": {
            modelResponse = model.updateSelectedBuild("trackType", 114); //  "OnRidePhoto" = 114,
            break;
        }
        case "brakes": {
            modelResponse = model.updateSelectedBuild("trackType", 99); //      "Brakes" = 99,
            break;
        }
        case "blockBrakes": {
            modelResponse = model.updateSelectedBuild("trackType", 216); //   "BlockBrakes" = 216,
            break;
        }
    }
    debug(`What pieces could be built given the currently pressed buttons?`);

    const pitchButton = buttonModel.selectedPitch.get();
    const bankButton = buttonModel.selectedBank.get();
    const curveButton = buttonModel.selectedCurve.get();
    const specialButton = buttonModel.selectedSpecial.get();
    const miscButton = buttonModel.selectedMisc.get();
    const detailButtons = buttonModel.selectedDetails.get();

    // todo also compare whether the button is enabled before saying that it's active.
    const pitchButtonActive = (pitchButton !== null ? pitchButton : undefined);
    const bankButtonActive = (bankButton !== null ? bankButton : undefined);
    const curveButtonActive = (curveButton !== null ? curveButton : undefined);
    const specialButtonActive = (specialButton !== null ? specialButton : undefined);
    const miscButtonActive = (miscButton !== null ? miscButton : undefined);
    const detailButtonsActive = (detailButtons !== null ? detailButtons : [] as DetailButton[]);


    const selectedElements: ButtonsActivelyPressed = {
        curve: curveButtonActive,
        bank: bankButtonActive,
        pitch: pitchButtonActive,
        special: specialButtonActive,
        misc: miscButtonActive,
        detail: detailButtonsActive,
    };

    model.trackTypeSelector.updateButtonsPushed(selectedElements);
    // model.buildableTrackByButtons.set(newBuildableTrackTypes);
    model.debugButtonChange({ buttonType, isPressed, modelResponse });

};
