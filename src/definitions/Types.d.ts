
/** Whether pointed forward (next), in the standard direction cars get launched, or backward (previous) */
type BuildDirection = "next" | "previous";

/** Whether to include segments a ride can validly build, or all the pieces that it can *technically* draw */
type DrawableSegmentBuildRule = "enabled" | "extra"; // todo implement covered


/**
 * Button group types
 */
type CurveButton =
    // direction buttons
    "left1Tile" |
    "left3Tile" |
    "left5Tile" |
    "noCurve" |
    "right1Tile" |
    "right3Tile" |
    "right5Tile" |
    "leftLargeTurn" | //diagonal
    "rightLargeTurn";  //diagonal

type BankButton =
    // banking
    "bankLeft" |
    "bankRight" |
    "noBank";

type PitchButton =
    "down90" |
    "down60" |
    "down25" |
    "noPitch" |
    "up25" |
    "up60" |
    "up90";

type DetailButton =
    "chainLift" |
    "covered";

type MiscButton =
    "sBendLeft" |
    "sBendRight" |
    "boosters" |
    "camera" |
    "brakes" |
    "blockBrakes" |
    "entrance" |
    "exit";

type SpecialButton = "special";

type ControlButton =
    "demolish" |
    "iterateNext" |
    "select" |
    "iteratePrevious" |
    "simulate" |
    "build";

type BuildWindowButton = SelectionButton | ControlButton;

type SelectionButton = CurveButton | BankButton | PitchButton | SpecialButton | DetailButton | MiscButton;

type AllButtons = {
    [key in BuildWindowButton]?: boolean;
};

// map SelectionControlButton to a boolean
type ControlButtons = {
    [key in ControlButton]?: boolean;
};

type ButtonPressCombination = {
    curve?: CurveButton;
    pitch?: PitchButton;
    bank?: BankButton;
    special?: SpecialButton;
    misc?: MiscButton;
    detail?: DetailButton[];
    controls: ControlButtons
};
