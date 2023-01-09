import { GlobalStateController } from './../objects/global/GlobalStateController';
import { button, toggle, ButtonParams, ToggleParams, FlexiblePosition, WidgetCreator } from 'openrct2-flexui';
import { onButtonChange } from '../objects/buttons/OnButtonChange';
import { shouldThisBePressed } from '../objects/buttons/buttonControls/toggleIsPickedControls';

// import { debug } from '../utilities/logger';

type ExtendedToggleParams = ToggleParams & {
    buttonType: BuildWindowButton,
};

type ExtendedButtonParams = ButtonParams & {
    buttonType: BuildWindowButton,
};

export class ElementWrapper {
    private _globalState: GlobalStateController;

    constructor(globalState: GlobalStateController) {
        this._globalState = globalState;
    }

    public button(params: ExtendedButtonParams & FlexiblePosition): WidgetCreator<FlexiblePosition> {
        const { buttonType, onClick, ...rest } = params;
        return button({
            disabled: this._globalState.buttonState.enabledButtons[buttonType],
            visibility: this._globalState.buttonState.visibleButtons[buttonType],
            onClick: () => {
                if (onClick) return onClick(); //override default behaviour if another is provided

                return onButtonChange({ buttonType, pressState: "oneTime", globalState: this._globalState });
            },
            ...rest
        });

    }

    public toggle(params: ExtendedToggleParams & FlexiblePosition): WidgetCreator<FlexiblePosition> {
        const { buttonType, onChange, ...rest } = params;

        return toggle({
            disabled: this._globalState.buttonState.enabledButtons[buttonType],
            visibility: this._globalState.buttonState.visibleButtons[buttonType],
            onChange: (isPressed?) => {
                if (onChange) return onChange(isPressed); //override default behaviour if another is provided

                return onButtonChange({ buttonType, pressState: isPressed ? "pressed" : "notPressed", globalState: this._globalState });
            },
            isPressed: shouldThisBePressed({ buttonType, globalState: this._globalState }),
            ...rest
        });

    }
}


