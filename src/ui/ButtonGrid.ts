import { horizontal, vertical, button, FlexibleLayoutContainer, FlexiblePosition, WidgetCreator, ButtonParams } from "openrct2-flexui";
import _ from "lodash-es";

// type ButtonType = (params: ButtonParams & FlexiblePosition) => WidgetCreator<FlexiblePosition>;

export const buttonGrid = ({ rows, columns, buttons, upImage, downImage, onScrollUp, onScrollDown }:
    {
        rows: number,
        columns: number,
        buttons: WidgetCreator<FlexiblePosition>[],
        gridWidth?: number,
        gridHeight?: number,
        upImage?: number,
        downImage?: number,

        onScrollUp?: () => void,
        onScrollDown?: () => void,
    }): WidgetCreator<FlexiblePosition> => {

    const numButtons = buttons.length;
    // there will be rows * columns number of buttons
    // if there are more buttons than that, we need to add a scrollbar
    // todo create the scrollbar

    const buttonGrid = _.chunk(buttons, columns);

    const layout = vertical({
        content: buttonGrid.map((row) =>
            horizontal({
                content: row
            }))
    });

    return layout;
    // for now let's assume there are exactly enough buttons to fill the grid.

};
