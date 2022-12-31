
// import { getButtonsForElement } from './../buttons/ButtonMap';
import { store, Store, ElementVisibility } from 'openrct2-flexui';
import { debug } from '~/src/utilities/logger';
import * as assertButton from '../buttons/ButtonAssertions';
import _ from 'lodash-es';

// import { getButtonsForElement } from '../buttons/ButtonMap';

type AllButtonsStores = Record<keyof AllButtons, Store<boolean>>;

// instantiate an empty allButtons object
const allButtonsEmpty: AllButtonsStores = {
    left1Tile: store(false),
    left3Tile: store(false),
    left5Tile: store(false),
    noCurve: store(false),
    right1Tile: store(false),
    right3Tile: store(false),
    right5Tile: store(false),
    leftLargeTurn: store(false),
    rightLargeTurn: store(false),
    bankLeft: store(false),
    bankRight: store(false),
    noBank: store(false),
    down90: store(false),
    down60: store(false),
    down25: store(false),
    noPitch: store(false),
    up25: store(false),
    up60: store(false),
    up90: store(false),
    chainLift: store(false),
    covered: store(false),
    sBendLeft: store(false),
    sBendRight: store(false),
    boosters: store(false),
    camera: store(false),
    brakes: store(false),
    blockBrakes: store(false),
    entrance: store(false),
    exit: store(false),
    special: store(false),
    demolish: store(false),
    iterateNext: store(false),
    select: store(false),
    iteratePrevious: store(false),
    simulate: store(false),
    build: store(false),
};

const allButtonsVisibilityEmpty: Record<keyof AllButtons, Store<ElementVisibility>> = _.mapValues(allButtonsEmpty, () => store(<ElementVisibility>"visible"));


interface IButtonStateController {
    /** Buttons/toggles which are actively toggled on and/or are one-time pressed. */
    readonly pressedButtons: AllButtonsStores;
    /** Keep track of which buttons are disabled (cannot be pressed). */
    readonly enabledButtons: AllButtonsStores
    /** Keep track of which buttons which are visible (cannot be pressed). */
    readonly visibleButtons: typeof allButtonsVisibilityEmpty;
    /** Keep track of the pressed buttons which are used for determining which TrackElementTypes are valid */
    readonly buttonPressCombination: ButtonPressCombination;

    getButtonPressCombination(): ButtonPressCombination;
    getPressedButtons(): { [key in BuildWindowButton]: boolean };
    getEnabledButtons(): { [key in BuildWindowButton]: boolean };
    getVisibleButtons(): { [key in BuildWindowButton]: ElementVisibility };
    getButtonStatus(button: BuildWindowButton): { pressed: boolean, enabled: boolean, visible: ElementVisibility };
}

export class ButtonStateController implements IButtonStateController {
    readonly pressedButtons: AllButtonsStores = { ...allButtonsEmpty };
    readonly enabledButtons: AllButtonsStores = { ...allButtonsEmpty };
    readonly visibleButtons = { ...allButtonsVisibilityEmpty };
    readonly buttonPressCombination: ButtonPressCombination = { controls: {} };


    /**
     * Get the state of visiblity, pressed, and enabled for the given button
     */
    getButtonStatus(button: BuildWindowButton): { pressed: boolean, enabled: boolean, visible: ElementVisibility } {
        return {
            pressed: this.pressedButtons[button].get(),
            enabled: this.enabledButtons[button].get(),
            visible: this.visibleButtons[button].get(),
        };
    }

    getPressedButtons(): { [key in BuildWindowButton]: boolean } {
        const pressedButtons = {} as { [key in BuildWindowButton]: boolean }
        for (const button in this.pressedButtons) {
            const val = this.pressedButtons[<keyof AllButtonsStores>button].get();
            if (val) {
                pressedButtons[<keyof AllButtonsStores>button] = val;
            }
            else
                pressedButtons[<keyof AllButtonsStores>button] = false;
        }
        return pressedButtons;
    }

    getEnabledButtons(): { [key in BuildWindowButton]: boolean } {
        const enabledButtons = {} as { [key in BuildWindowButton]: boolean }
        for (const button in this.enabledButtons) {
            const val = this.enabledButtons[<keyof AllButtonsStores>button].get();
            if (val) {
                enabledButtons[<keyof AllButtonsStores>button] = val;
            }
            else
                enabledButtons[<keyof AllButtonsStores>button] = false;
        }
        return enabledButtons;
    }

    getVisibleButtons(): { [key in BuildWindowButton]: ElementVisibility } {
        const visibleButtons = {} as { [key in BuildWindowButton]: ElementVisibility }
        for (const button in this.visibleButtons) {
            const val = this.visibleButtons[<keyof AllButtonsStores>button].get();
            if (val) {
                visibleButtons[<keyof AllButtonsStores>button] = val;
            }
            else
                visibleButtons[<keyof AllButtonsStores>button] = "none";
        }
        return visibleButtons;
    }

    getButtonPressCombination(): ButtonPressCombination {

    }

    // could be to get the ones that are pressed, the ones that are visible, etc.
    getTruthyValueButtonsFromStores(buttons: AllButtonsStores): ButtonPressCombination {
        // need to get all the true values from the  buttons' stores, and then sort them by their type, and if there are too many return the 0th index and log an error
        const trueButtons = {
            curve: <CurveButton[]>[],
            bank: <BankButton[]>[],
            pitch: <PitchButton[]>[],
            special: <SpecialButton[]>[],
            detail: <DetailButton[]>[],
            misc: <MiscButton[]>[],
            controls: <ControlButton[]>[],
        };

        for (const buttonType in buttons) {
            const buttonCategory = getButtonCategory(<BuildWindowButton>buttonType);
            if (buttonCategory === undefined) continue;
            const val = buttons[<BuildWindowButton>buttonType].get();
            if (val) {
                trueButtons[buttonCategory].push({ [key: buttonCategory]: val });
            }
        }


        // switch (buttonCategory) {
        //     case "controls":
        //         trueButtons.control.push(<ControlButton>buttonType); continue;
        //     case "curve":
        //         trueButtons.curve.push(<CurveButton>buttonType); continue;
        //     case "bank":
        //         trueButtons.bank.push(<BankButton>buttonType); continue;
        //     case "pitch":
        //         trueButtons.pitch.push(<PitchButton>buttonType); continue;
        //     case "special":
        //         trueButtons.special.push(<SpecialButton>buttonType); continue;
        //     case "detail":
        //         trueButtons.detail.push(<DetailButton>buttonType); continue;
        //     case "misc":
        //         trueButtons.misc.push(<MiscButton>buttonType); continue;
        //     default:
        //         debug(`Button category for ${buttonType} is not a valid category.`);
        // }
    }

    updateCurveButton(button: CurveButton, pressed: boolean) {
        const oldPressed = this.buttonPressCombination.curve//this.pressedButtons[button].get();
        this.pressedButtons[button].set(pressed);
    }


}
const getButtonCategory = (button: BuildWindowButton): keyof ButtonPressCombination | undefined => {
    if (assertButton.isCurveButton(button)) {
        return "curve";
    }
    if (assertButton.isBankButton(button)) {
        return "bank";
    }
    if (assertButton.isPitchButton(button)) {
        return "pitch";
    }
    if (assertButton.isSpecialButton(button)) {
        return "special";
    }
    if (assertButton.isDetailButton(button)) {
        return "detail";
    }
    if (assertButton.isMiscButton(button)) {
        return "misc";
    }
    if (assertButton.isControlButton(button)) {
        return "controls";
    }
    return undefined;
};
