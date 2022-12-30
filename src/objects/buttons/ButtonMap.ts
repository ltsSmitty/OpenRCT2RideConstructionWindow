/* eslint-disable prefer-const */
import { TrackElementType } from "src/utilities/trackElementType";
import { CurveButton, PitchButton, BankButton, SpecialButton, DetailButton, SelectionButton, MiscButton } from "./ButtonTypes";
import { debug } from 'src/utilities/logger';
import _ from 'lodash-es';

/**
 * The set of buttons which are actively pressed (excludes buttons which are pressed but which are disabled).
 */
export type ButtonsActivelyPressed = {
    curve?: CurveButton;
    pitch?: PitchButton;
    bank?: BankButton;
    special?: SpecialButton;
    misc?: MiscButton;
    detail?: DetailButton[];
};

type ButtonToElementMap = Record<TrackElementType, ButtonsActivelyPressed>;


// polyfill for Object.values
if (!Object.values) {
    Object.values = function (obj: { [x: string]: unknown; }): unknown[] {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
}

export const getButtonsForElement = (element: TrackElementType): SelectionButton[] => {
    const buttonSet = trackElementToButtonMap[element];
    const buttons = _.flatMap(Object.values(buttonSet));
    return buttons;
};

// todo actually write this out
const getTrackElementTypesByRideType = (rideType: number): TrackElementType[] => {
    // return all the TrackELementTypes
    return Object.keys(trackElementToButtonMap).map((key) => parseInt(key)) as TrackElementType[];
};

export const getValidButtonSetForRideType = (rideType: number): SelectionButton[] => {
    const validElements = getTrackElementTypesByRideType(rideType);

    const buttonsForELements = validElements.map(element => getButtonsForElement(element));
    const allButtons = _.flatMapDeep(buttonsForELements);
    const uniqueButtons = _.uniq(allButtons);
    return uniqueButtons;
};

const trackElementToButtonMap: ButtonToElementMap = {
    // Go through each TrackELementType and store the array of buttons that are needed to place the element
    0: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Flat
    1: { special: `special` }, // EndStation
    2: { special: `special` }, // BeginStation
    3: { special: `special` }, // MiddleStation
    4: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // Up25
    5: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // Up60
    6: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // FlatToUp25
    7: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // Up25ToUp60
    8: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // Up60ToUp25
    9: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Up25ToFlat
    10: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // Down25
    11: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // Down60
    12: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // FlatToDown25
    13: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // Down25ToDown60
    14: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // Down60ToDown25
    15: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Down25ToFlat
    16: { curve: 'left5Tile', pitch: 'noPitch', bank: 'noBank' }, // LeftQuarterTurn5Tiles
    17: { curve: 'right5Tile', pitch: 'noPitch', bank: 'noBank' }, // RightQuarterTurn5Tiles
    18: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // FlatToLeftBank
    19: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // FlatToRightBank
    20: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankToFlat
    21: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankToFlat
    22: { curve: 'left5Tile', pitch: 'noPitch', bank: 'bankLeft' }, // BankedLeftQuarterTurn5Tiles
    23: { curve: 'right5Tile', pitch: 'noPitch', bank: 'bankRight' }, // BankedRightQuarterTurn5Tiles
    24: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // LeftBankToUp25
    25: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // RightBankToUp25
    26: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // Up25ToLeftBank
    27: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // Up25ToRightBank
    28: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // LeftBankToDown25
    29: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // RightBankToDown25
    30: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // Down25ToLeftBank
    31: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // Down25ToRightBank
    32: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // LeftBank
    33: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // RightBank
    34: { curve: 'left5Tile', pitch: 'up25', bank: 'noBank' }, // LeftQuarterTurn5TilesUp25
    35: { curve: 'right5Tile', pitch: 'up25', bank: 'noBank' }, // RightQuarterTurn5TilesUp25
    36: { curve: 'left5Tile', pitch: 'down25', bank: 'noBank' }, // LeftQuarterTurn5TilesDown25
    37: { curve: 'right5Tile', pitch: 'down25', bank: 'noBank' }, // RightQuarterTurn5TilesDown25
    38: { misc: 'sBendLeft' }, // SBendLeft
    39: { misc: 'sBendRight' }, // SBendRight
    40: { special: `special` }, // LeftVerticalLoop
    41: { special: `special` }, // RightVerticalLoop
    42: { curve: 'left3Tile', pitch: 'noPitch', bank: 'noBank' }, // LeftQuarterTurn3Tiles
    43: { curve: 'right3Tile', pitch: 'noPitch', bank: 'noBank' }, // RightQuarterTurn3Tiles
    44: { curve: 'left3Tile', pitch: 'noPitch', bank: 'bankLeft' }, // LeftBankedQuarterTurn3Tiles
    45: { curve: 'right3Tile', pitch: 'noPitch', bank: 'bankRight' }, // RightBankedQuarterTurn3Tiles
    46: { curve: 'left3Tile', pitch: 'up25', bank: 'noBank' }, // LeftQuarterTurn3TilesUp25
    47: { curve: 'right3Tile', pitch: 'up25', bank: 'noBank' }, // RightQuarterTurn3TilesUp25
    48: { curve: 'left3Tile', pitch: 'down25', bank: 'noBank' }, // LeftQuarterTurn3TilesDown25
    49: { curve: 'right3Tile', pitch: 'down25', bank: 'noBank' }, // RightQuarterTurn3TilesDown25
    50: { curve: 'left1Tile', pitch: 'noPitch', bank: 'noBank' }, // LeftQuarterTurn1Tile
    51: { curve: 'right1Tile', pitch: 'noPitch', bank: 'noBank' }, // RightQuarterTurn1Tile
    52: { special: `special` }, // LeftTwistDownToUp
    53: { special: `special` }, // RightTwistDownToUp
    54: { special: `special` }, // LeftTwistUpToDown
    55: { special: `special` }, // RightTwistUpToDown
    56: { special: `special` }, // HalfLoopUp
    57: { special: `special` }, // HalfLoopDown
    58: { special: `special` }, // LeftCorkscrewUp
    59: { special: `special` }, // RightCorkscrewUp
    60: { special: `special` }, // LeftCorkscrewDown
    61: { special: `special` }, // RightCorkscrewDown
    62: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // FlatToUp60
    63: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Up60ToFlat
    64: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // FlatToDown60
    65: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Down60ToFlat
    66: { special: `special` }, // TowerBase
    67: { special: `special` }, // TowerSection
    68: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // FlatCovered
    69: { curve: 'noCurve', pitch: 'up25', bank: 'noBank', detail: ["covered"] }, // Up25Covered
    70: { curve: 'noCurve', pitch: 'up60', bank: 'noBank', detail: ["covered"] }, // Up60Covered
    71: { curve: 'noCurve', pitch: 'up25', bank: 'noBank', detail: ["covered"] }, // FlatToUp25Covered
    72: { curve: 'noCurve', pitch: 'up60', bank: 'noBank', detail: ["covered"] }, // Up25ToUp60Covered
    73: { curve: 'noCurve', pitch: 'up25', bank: 'noBank', detail: ["covered"] }, // Up60ToUp25Covered
    74: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // Up25ToFlatCovered
    75: { curve: 'noCurve', pitch: 'down25', bank: 'noBank', detail: ["covered"] }, // Down25Covered
    76: { curve: 'noCurve', pitch: 'down60', bank: 'noBank', detail: ["covered"] }, // Down60Covered
    77: { curve: 'noCurve', pitch: 'down25', bank: 'noBank', detail: ["covered"] }, // FlatToDown25Covered
    78: { curve: 'noCurve', pitch: 'down60', bank: 'noBank', detail: ["covered"] }, // Down25ToDown60Covered
    79: { curve: 'noCurve', pitch: 'down25', bank: 'noBank', detail: ["covered"] }, // Down60ToDown25Covered
    80: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // Down25ToFlatCovered
    81: { curve: 'left5Tile', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // LeftQuarterTurn5TilesCovered
    82: { curve: 'right5Tile', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // RightQuarterTurn5TilesCovered
    83: { misc: 'sBendLeft', detail: ["covered"] }, // SBendLeftCovered
    84: { misc: 'sBendRight', detail: ["covered"] }, // SBendRightCovered
    85: { curve: 'left3Tile', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // LeftQuarterTurn3TilesCovered
    86: { curve: 'right3Tile', pitch: 'noPitch', bank: 'noBank', detail: ["covered"] }, // RightQuarterTurn3TilesCovered
    87: { special: `special` }, // LeftHalfBankedHelixUpSmall
    88: { special: `special` }, // RightHalfBankedHelixUpSmall
    89: { special: `special` }, // LeftHalfBankedHelixDownSmall
    90: { special: `special` }, // RightHalfBankedHelixDownSmall
    91: { special: `special` }, // LeftHalfBankedHelixUpLarge
    92: { special: `special` }, // RightHalfBankedHelixUpLarge
    93: { special: `special` }, // LeftHalfBankedHelixDownLarge
    94: { special: `special` }, // RightHalfBankedHelixDownLarge
    95: { curve: 'left3Tile', pitch: 'up60', bank: 'noBank' }, // LeftQuarterTurn1TileUp60
    96: { curve: 'right3Tile', pitch: 'up60', bank: 'noBank' }, // RightQuarterTurn1TileUp60
    97: { curve: 'left3Tile', pitch: 'down60', bank: 'noBank' }, // LeftQuarterTurn1TileDown60
    98: { curve: 'right3Tile', pitch: 'down60', bank: 'noBank' }, // RightQuarterTurn1TileDown60
    99: { misc: 'brakes' }, // Brakes and also the RotationControlToggleAlias
    100: { misc: 'boosters' }, // Booster
    101: { special: `special` }, // Maze
    102: { special: `special` }, // LeftQuarterBankedHelixLargeUp
    103: { special: `special` }, // RightQuarterBankedHelixLargeUp
    104: { special: `special` }, // LeftQuarterBankedHelixLargeDown
    105: { special: `special` }, // RightQuarterBankedHelixLargeDown
    106: { special: `special` }, // LeftQuarterHelixLargeUp
    107: { special: `special` }, // RightQuarterHelixLargeUp
    108: { special: `special` }, // LeftQuarterHelixLargeDown
    109: { special: `special` }, // RightQuarterHelixLargeDown
    110: { curve: 'noCurve', pitch: 'up25', bank: 'bankLeft' }, // Up25LeftBanked
    111: { curve: 'noCurve', pitch: 'up25', bank: 'bankRight' }, // Up25RightBanked
    112: { special: `special` }, // Waterfall
    113: { special: `special` }, // Rapids
    114: { misc: 'camera' }, // OnRidePhoto
    115: { curve: 'noCurve', pitch: 'down25', bank: 'bankLeft' }, // Down25LeftBanked
    116: { curve: 'noCurve', pitch: 'down25', bank: 'bankRight' }, // Down25RightBanked
    117: { special: `special` }, // Watersplash
    118: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // FlatToUp60LongBase
    119: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Up60ToFlatLongBase
    120: { special: `special` }, // Whirlpool
    121: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // Down60ToFlatLongBase
    122: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // FlatToDown60LongBase
    123: { special: `special` }, // CableLiftHill
    124: { special: `special` }, // ReverseFreefallSlope
    125: { special: `special` }, // ReverseFreefallVertical
    126: { curve: 'noCurve', pitch: 'up90', bank: 'noBank' }, // Up90
    127: { curve: 'noCurve', pitch: 'down90', bank: 'noBank' }, // Down90
    128: { curve: 'noCurve', pitch: 'up90', bank: 'noBank' }, // Up60ToUp90
    129: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // Down90ToDown60
    130: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // Up90ToUp60
    131: { curve: 'noCurve', pitch: 'down90', bank: 'noBank' }, // Down60ToDown90
    132: { special: `special` }, // BrakeForDrop
    133: { curve: 'leftLargeTurn', pitch: 'noPitch', bank: 'noBank' }, // LeftEighthToDiag
    134: { curve: 'rightLargeTurn', pitch: 'noPitch', bank: 'noBank' }, // RightEighthToDiag
    135: { curve: 'leftLargeTurn', pitch: 'noPitch', bank: 'noBank' }, // LeftEighthToOrthogonal
    136: { curve: 'rightLargeTurn', pitch: 'noPitch', bank: 'noBank' }, // RightEighthToOrthogonal
    137: { curve: 'leftLargeTurn', pitch: 'noPitch', bank: 'bankLeft' }, // LeftEighthBankToDiag
    138: { curve: 'rightLargeTurn', pitch: 'noPitch', bank: 'bankRight' }, // RightEighthBankToDiag
    139: { curve: 'leftLargeTurn', pitch: 'noPitch', bank: 'bankLeft' }, // LeftEighthBankToOrthogonal
    140: { curve: 'rightLargeTurn', pitch: 'noPitch', bank: 'bankRight' }, // RightEighthBankToOrthogonal
    141: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagFlat
    142: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // DiagUp25
    143: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // DiagUp60
    144: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // DiagFlatToUp25
    145: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // DiagUp25ToUp60
    146: { curve: 'noCurve', pitch: 'up25', bank: 'noBank' }, // DiagUp60ToUp25
    147: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagUp25ToFlat
    148: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // DiagDown25
    149: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // DiagDown60
    150: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // DiagFlatToDown25
    151: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // DiagDown25ToDown60
    152: { curve: 'noCurve', pitch: 'down25', bank: 'noBank' }, // DiagDown60ToDown25
    153: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagDown25ToFlat
    154: { curve: 'noCurve', pitch: 'up60', bank: 'noBank' }, // DiagFlatToUp60
    155: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagUp60ToFlat
    156: { curve: 'noCurve', pitch: 'down60', bank: 'noBank' }, // DiagFlatToDown60
    157: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagDown60ToFlat
    158: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // DiagFlatToLeftBank
    159: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // DiagFlatToRightBank
    160: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagLeftBankToFlat
    161: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // DiagRightBankToFlat
    162: { curve: 'noCurve', pitch: 'up25', bank: 'bankLeft' }, // DiagLeftBankToUp25
    163: { curve: 'noCurve', pitch: 'up25', bank: 'bankRight' }, // DiagRightBankToUp25
    164: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // DiagUp25ToLeftBank
    165: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // DiagUp25ToRightBank
    166: { curve: 'noCurve', pitch: 'down25', bank: 'bankLeft' }, // DiagLeftBankToDown25
    167: { curve: 'noCurve', pitch: 'down25', bank: 'bankRight' }, // DiagRightBankToDown25
    168: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // DiagDown25ToLeftBank
    169: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // DiagDown25ToRightBank
    170: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // DiagLeftBank
    171: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // DiagRightBank
    172: { special: `special` }, // LogFlumeReverser
    173: { special: `special` }, // SpinningTunnel
    174: { special: `special` }, // LeftBarrelRollUpToDown
    175: { special: `special` }, // RightBarrelRollUpToDown
    176: { special: `special` }, // LeftBarrelRollDownToUp
    177: { special: `special` }, // RightBarrelRollDownToUp
    178: { curve: 'left3Tile', pitch: 'up25', bank: 'noBank' }, // LeftBankToLeftQuarterTurn3TilesUp25
    179: { curve: 'right3Tile', pitch: 'up25', bank: 'noBank' }, // RightBankToRightQuarterTurn3TilesUp25
    180: { curve: 'left3Tile', pitch: 'down25', bank: 'noBank' }, // LeftQuarterTurn3TilesDown25ToLeftBank
    181: { curve: 'right3Tile', pitch: 'down25', bank: 'noBank' }, // RightQuarterTurn3TilesDown25ToRightBank
    182: { special: `special` }, // PoweredLift
    183: { special: `special` }, // LeftLargeHalfLoopUp
    184: { special: `special` }, // RightLargeHalfLoopUp
    185: { special: `special` }, // RightLargeHalfLoopDown
    186: { special: `special` }, // LeftLargeHalfLoopDown
    187: { special: `special` }, // LeftFlyerTwistUp
    188: { special: `special` }, // RightFlyerTwistUp
    189: { special: `special` }, // LeftFlyerTwistDown
    190: { special: `special` }, // RightFlyerTwistDown
    191: { special: `special` }, // FlyerHalfLoopUninvertedUp
    192: { special: `special` }, // FlyerHalfLoopInvertedDown
    193: { special: `special` }, // LeftFlyerCorkscrewUp
    194: { special: `special` }, // RightFlyerCorkscrewUp
    195: { special: `special` }, // LeftFlyerCorkscrewDown
    196: { special: `special` }, // RightFlyerCorkscrewDown
    197: { special: `special` }, // HeartLineTransferUp
    198: { special: `special` }, // HeartLineTransferDown
    199: { special: `special` }, // LeftHeartLineRoll
    200: { special: `special` }, // RightHeartLineRoll
    201: { special: `special` }, // MinigolfHoleA
    202: { special: `special` }, // MinigolfHoleB
    203: { special: `special` }, // MinigolfHoleC
    204: { special: `special` }, // MinigolfHoleD
    205: { special: `special` }, // MinigolfHoleE
    206: { special: `special` }, // MultiDimInvertedFlatToDown90QuarterLoop
    207: { special: `special` }, // Up90ToInvertedFlatQuarterLoop
    208: { special: `special` }, // InvertedFlatToDown90QuarterLoop
    209: { special: `special` }, // LeftCurvedLiftHill
    210: { special: `special` }, // RightCurvedLiftHill
    211: { special: `special` }, // LeftReverser
    212: { special: `special` }, // RightReverser
    213: { special: `special` }, // AirThrustTopCap
    214: { special: `special` }, // AirThrustVerticalDown
    215: { special: `special` }, // AirThrustVerticalDownToLevel
    216: { misc: 'blockBrakes' }, // BlockBrakes
    217: { curve: 'left3Tile', pitch: 'up25', bank: 'bankLeft' }, // LeftBankedQuarterTurn3TileUp25
    218: { curve: 'right3Tile', pitch: 'up25', bank: 'bankRight' }, // RightBankedQuarterTurn3TileUp25
    219: { curve: 'left3Tile', pitch: 'down25', bank: 'bankLeft' }, // LeftBankedQuarterTurn3TileDown25
    220: { curve: 'right3Tile', pitch: 'down25', bank: 'bankRight' }, // RightBankedQuarterTurn3TileDown25
    221: { curve: 'left5Tile', pitch: 'up25', bank: 'bankLeft' }, // LeftBankedQuarterTurn5TileUp25
    222: { curve: 'right5Tile', pitch: 'up25', bank: 'bankRight' }, // RightBankedQuarterTurn5TileUp25
    223: { curve: 'left5Tile', pitch: 'down25', bank: 'bankLeft' }, // LeftBankedQuarterTurn5TileDown25
    224: { curve: 'right5Tile', pitch: 'down25', bank: 'bankRight' }, // RightBankedQuarterTurn5TileDown25
    225: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // Up25ToLeftBankedUp25
    226: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // Up25ToRightBankedUp25
    227: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankedUp25ToUp25
    228: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankedUp25ToUp25
    229: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // Down25ToLeftBankedDown25
    230: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // Down25ToRightBankedDown25
    231: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankedDown25ToDown25
    232: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankedDown25ToDown25
    233: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // LeftBankedFlatToLeftBankedUp25
    234: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // RightBankedFlatToRightBankedUp25
    235: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // LeftBankedUp25ToLeftBankedFlat
    236: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // RightBankedUp25ToRightBankedFlat
    237: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // LeftBankedFlatToLeftBankedDown25
    238: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // RightBankedFlatToRightBankedDown25
    239: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankedDown25ToLeftBankedFlat
    240: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankedDown25ToRightBankedFlat
    241: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // FlatToLeftBankedUp25
    242: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // FlatToRightBankedUp25
    243: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankedUp25ToFlat
    244: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankedUp25ToFlat
    245: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankLeft' }, // FlatToLeftBankedDown25
    246: { curve: 'noCurve', pitch: 'noPitch', bank: 'bankRight' }, // FlatToRightBankedDown25
    247: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // LeftBankedDown25ToFlat
    248: { curve: 'noCurve', pitch: 'noPitch', bank: 'noBank' }, // RightBankedDown25ToFlat
    249: { curve: 'left3Tile', pitch: 'up90', bank: 'noBank' }, // LeftQuarterTurn1TileUp90
    250: { curve: 'right3Tile', pitch: 'up90', bank: 'noBank' }, // RightQuarterTurn1TileUp90
    251: { curve: 'left3Tile', pitch: 'down90', bank: 'noBank' }, // LeftQuarterTurn1TileDown90
    252: { curve: 'right3Tile', pitch: 'down90', bank: 'noBank' }, // RightQuarterTurn1TileDown90
    253: { special: `special` }, // MultiDimUp90ToInvertedFlatQuarterLoop
    254: { special: `special` }, // MultiDimFlatToDown90QuarterLoop
    255: { special: `special` }, // MultiDimInvertedUp90ToFlatQuarterLoop
    256: { special: `special` }, // RotationControlToggle // currently undocumented


    // 257-265: These are unused, and all the pieces after are OpenRCT pieces: {
    267: { special: `special` }, // LeftLargeCorkscrewUp
    268: { special: `special` }, // RightLargeCorkscrewUp
    269: { special: `special` }, // LeftLargeCorkscrewDown
    270: { special: `special` }, // RightLargeCorkscrewDown
    271: { special: `special` }, // LeftMediumHalfLoopUp
    272: { special: `special` }, // RightMediumHalfLoopUp
    273: { special: `special` }, // LeftMediumHalfLoopDown
    274: { special: `special` }, // RightMediumHalfLoopDown
    275: { special: `special` }, // LeftZeroGRollUp
    276: { special: `special` }, // RightZeroGRollUp
    277: { special: `special` }, // LeftZeroGRollDown
    278: { special: `special` }, // RightZeroGRollDown
    279: { special: `special` }, // LeftLargeZeroGRollUp
    280: { special: `special` }, // RightLargeZeroGRollUp
    281: { special: `special` }, // LeftLargeZeroGRollDown
    282: { special: `special` }, // RightLargeZeroGRollDown
    283: { special: `special` }, // LeftFlyerLargeHalfLoopUninvertedUp
    284: { special: `special` }, // RightFlyerLargeHalfLoopUninvertedUp
    285: { special: `special` }, // RightFlyerLargeHalfLoopInvertedDown
    286: { special: `special` }, // LeftFlyerLargeHalfLoopInvertedDown
    287: { special: `special` }, // LeftFlyerLargeHalfLoopInvertedUp
    288: { special: `special` }, // RightFlyerLargeHalfLoopInvertedUp
    289: { special: `special` }, // RightFlyerLargeHalfLoopUninvertedDown
    290: { special: `special` }, // LeftFlyerLargeHalfLoopUninvertedDown
    291: { special: `special` }, // FlyerHalfLoopInvertedUp
    292: { special: `special` }, // FlyerHalfLoopUninvertedDown
};

/**
 *Given the buttons that are pressed, return the track elements that are possible to build. Filtering this response with the direction (next/previous), piece end details, and the current segment (e.g. diagonal, inverted, covered or not), this should narrow down the possible track elements to build to one single piece.
 * @param activelyPressedButtons The buttons which are pressed AND active (i.e. not disabled)
 * @param availableTrackElementTypes The track elements that are available to build. This might include only the standard allowed pieces, or might include the extra pieces that are drawable but not technically allowed to be built.
 * @returns
 */
export const getElementsFromGivenButtons = (activelyPressedButtons: ButtonsActivelyPressed, availableTrackElementTypes: TrackElementType[] = allTrackELementTypes): TrackElementType[] => {

    debug(`Searching for TrackElements that can be built with buttons: ${JSON.stringify(activelyPressedButtons)}`);
    debug(`activelyPressedButtons: ${JSON.stringify(activelyPressedButtons, null, 2)}`);

    const matchingTrackElements = availableTrackElementTypes.filter((element) => {
        const elementButtonMap = trackElementToButtonMap[element];

        const curvesMatch = activelyPressedButtons.curve === elementButtonMap.curve;
        const pitchesMatch = activelyPressedButtons.pitch === elementButtonMap.pitch;
        const banksMatch = activelyPressedButtons.bank === elementButtonMap.bank;
        const miscsMatch = activelyPressedButtons.misc === elementButtonMap.misc;
        const specialsMatch = activelyPressedButtons.special === elementButtonMap.special;
        const detailsMatch = (activelyPressedButtons.detail?.length == 0 && elementButtonMap.detail?.length == 0) ||
            activelyPressedButtons.detail?.every((detail, index) => (elementButtonMap.detail && detail === elementButtonMap.detail[index]));


        return curvesMatch && pitchesMatch && banksMatch && miscsMatch && specialsMatch && detailsMatch;
    });

    debug(`matchingTrackElements: ${JSON.stringify(matchingTrackElements, null, 2)}`)
    return matchingTrackElements;
};

const allTrackELementTypes = Object.keys(trackElementToButtonMap).map((key) => parseInt(key)) as TrackElementType[];

