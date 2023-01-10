/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { GlobalStateController } from '~/src/objects/global/GlobalStateController';
import * as assertButton from '~/src/objects/buttons/ButtonAssertions';
import { compute, Store } from "openrct2-flexui";
import { debug } from '~/src/utilities/logger';

export const shouldThisBePressed =
    ({ buttonType, globalState }: { buttonType: BuildWindowButton, globalState: GlobalStateController }): Store<boolean> => {
        const { buttonState } = globalState;
        const { buttonPressCombination } = buttonState;

        if (assertButton.isBankButton(buttonType)) {
            return compute(buttonPressCombination.bank, (b) => {
                // debug(`shouldThisBePressed: bank button ${buttonType} is ${b === buttonType}`);
                if (b === buttonType) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        // do the same with curve and pitch
        if (assertButton.isCurveButton(buttonType)) {
            return compute(buttonPressCombination.curve, (b) => {
                // debug(`shouldThisBePressed: curve button ${buttonType} is ${b === buttonType}`);
                if (b === buttonType) {
                    return true;
                } else {
                    return false;
                }
            });
        }

        if (assertButton.isPitchButton(buttonType)) {
            return compute(buttonPressCombination.pitch, (b) => {
                // debug(`shouldThisBePressed: pitch button ${buttonType} is ${b === buttonType}`);
                if (b === buttonType) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        return buttonState.pressedButtons[buttonType];
    };
