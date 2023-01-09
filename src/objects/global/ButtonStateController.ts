/* eslint-disable @typescript-eslint/restrict-template-expressions */
// import { getButtonsForElement } from './../buttons/ButtonMap';
import { store, Store, ElementVisibility } from 'openrct2-flexui';
// import { debug } from '~/src/utilities/logger';
// import * as assertButton from '../buttons/ButtonAssertions';
import _ from 'lodash-es';
import { debug } from '~/src/utilities/logger';

// import { getButtonsForElement } from '../buttons/ButtonMap';

type AllButtonsStores = Record<keyof AllButtons, Store<boolean>>;

type ButtonPressCombination = {
    curve: Store<CurveButton | null>,
    bank: Store<BankButton | null>,
    pitch: Store<PitchButton | null>,
    detail: {
        chainLift: Store<boolean>,
        covered: Store<boolean>,
    },
    misc: Store<MiscButton | null>,
    special: Store<SpecialButton | null>,
    controls: {
        demolish: Store<boolean>,
        iterateNext: Store<boolean>,
        select: Store<boolean>,
        iteratePrevious: Store<boolean>,
        simulate: Store<boolean>,
        build: Store<boolean>,
    }
};

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


// instantiate an empty ButtonPressCombination object with all null store values
const buttonPressCombinationEmpty: ButtonPressCombination = {
    curve: store<CurveButton | null>(null),
    bank: store<BankButton | null>(null),
    pitch: store<PitchButton | null>(null),
    detail: {
        chainLift: store<boolean>(false),
        covered: store<boolean>(false),
    },
    misc: store<MiscButton | null>(null),
    special: store<SpecialButton | null>(null),
    controls: {
        demolish: store<boolean>(false),
        iterateNext: store<boolean>(false),
        select: store<boolean>(false),
        iteratePrevious: store<boolean>(false),
        simulate: store<boolean>(false),
        build: store<boolean>(false),
    }
};

interface IButtonStateController {
    /** Buttons/toggles which are actively toggled on and/or are one-time pressed. */
    readonly pressedButtons: AllButtonsStores;
    /** Keep track of which buttons are disabled (cannot be pressed). */
    readonly enabledButtons: AllButtonsStores
    /** Keep track of which buttons which are visible (cannot be pressed). */
    readonly visibleButtons: typeof allButtonsVisibilityEmpty;


    /** Keep track of the pressed buttons which are used for determining which TrackElementTypes are valid */
    getButtonPressCombinationStores(): ButtonPressCombination;
    getPressedButtons(): { [key in BuildWindowButton]: boolean };
    getEnabledButtons(): { [key in BuildWindowButton]: boolean };
    getVisibleButtons(): { [key in BuildWindowButton]: ElementVisibility };
    getButtonStatus(button: BuildWindowButton): { pressed: boolean, enabled: boolean, visible: ElementVisibility };

    updateCurve({ button, isPressed }: { button: CurveButton, isPressed: ButtonPressOption }): void;
    updateBank({ button, isPressed }: { button: BankButton, isPressed: ButtonPressOption }): void;
    updatePitch({ button, isPressed }: { button: PitchButton, isPressed: ButtonPressOption }): void;
    updateSpecial({ button, isPressed }: { button: SpecialButton, isPressed: ButtonPressOption }): void;
    updateMisc({ button, isPressed }: { button: MiscButton, isPressed: ButtonPressOption }): void;
    updateDetail({ button, isPressed }: { button: DetailButton, isPressed: ButtonPressOption }): void;
    updateControl({ button, isPressed }: { button: ControlButton, isPressed: ButtonPressOption }): void;

}

export class ButtonStateController implements IButtonStateController {
    // export class ButtonStateController {
    readonly pressedButtons: AllButtonsStores = _.cloneDeep(allButtonsEmpty);
    readonly enabledButtons: AllButtonsStores = _.cloneDeep(allButtonsEmpty);
    readonly visibleButtons = _.cloneDeep(allButtonsVisibilityEmpty);
    readonly buttonPressCombination = _.cloneDeep(buttonPressCombinationEmpty);

    constructor() {
        this.enabledButtons.bankLeft.subscribe((enabled) => debug(`bankLeft disabled changed to ${enabled}`, true));
    }

    getButtonPressCombinationStores(): ButtonPressCombination {
        return this.buttonPressCombination;
    }

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
        const pressedButtons = {} as { [key in BuildWindowButton]: boolean };
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
        const enabledButtons = {} as { [key in BuildWindowButton]: boolean };
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
        const visibleButtons = {} as { [key in BuildWindowButton]: ElementVisibility };
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

    updateCurve = ({ button, isPressed }: { button: CurveButton, isPressed: ButtonPressOption }): void => {
        // get the old pressed curve button
        const oldPressed = this.buttonPressCombination.curve.get();
        if (oldPressed == button) {
            // if the old pressed button is the same as the new pressed button
            // force the button to be pressed
            this.buttonPressCombination.curve.set(null);  // the only way to get the store to recalculate is to set it null and then set it to the value
            this.buttonPressCombination.curve.set(button);
            return;
        }
        if (oldPressed) {
            // set the old pressed button to not be pressed
            this.pressedButtons[oldPressed].set(false);
        }
        // set the new pressed button to be pressed
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
        this.buttonPressCombination.curve.set(button);
    };

    updateBank = ({ button, isPressed }: { button: BankButton, isPressed: ButtonPressOption }): void => {
        const oldPressed = this.buttonPressCombination.bank.get();
        if (oldPressed == button) {
            this.buttonPressCombination.bank.set(null);
            this.buttonPressCombination.bank.set(button);
            return;
        }
        if (oldPressed) {
            // set the old pressed button to not be pressed
            this.pressedButtons[oldPressed].set(false);
        }
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
        this.buttonPressCombination.bank.set(button);
    };

    updatePitch = ({ button, isPressed }: { button: PitchButton, isPressed: ButtonPressOption }): void => {
        const oldPressed = this.buttonPressCombination.pitch.get();
        if (oldPressed == button) {
            this.buttonPressCombination.pitch.set(null);
            this.buttonPressCombination.pitch.set(button);
            return;
        }
        if (oldPressed) {
            this.pressedButtons[oldPressed].set(false);
        }
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
        this.buttonPressCombination.pitch.set(button);
    };

    updateSpecial = ({ button, isPressed }: { button: SpecialButton, isPressed: ButtonPressOption }): void => {
        const oldPressed = this.buttonPressCombination.special.get();
        if (oldPressed) {
            this.pressedButtons[oldPressed].set(false);
        }
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
        this.buttonPressCombination.special.set(button);
    };

    updateMisc = ({ button, isPressed }: { button: MiscButton, isPressed: ButtonPressOption }): void => {
        const oldPressed = this.buttonPressCombination.misc.get();
        if (oldPressed) {
            this.pressedButtons[oldPressed].set(false);
        }
        this.buttonPressCombination.misc.set(button);
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
    };

    // Detail and Controls both are arrays, so they have some different handling
    updateDetail = ({ button, isPressed }: { button: DetailButton, isPressed: ButtonPressOption }): void => {
        this.buttonPressCombination.detail[button].set(isPressed == "pressed" ? true : false);
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
    };

    updateControl = ({ button, isPressed }: { button: ControlButton, isPressed: ButtonPressOption }): void => {
        this.buttonPressCombination.controls[button].set(isPressed == "pressed" ? true : false);
        this.pressedButtons[button].set(isPressed == "pressed" ? true : false);
    };
}
