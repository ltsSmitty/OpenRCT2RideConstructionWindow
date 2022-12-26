import { TrackElementType } from "~/src/utilities/trackElementType";

export default (type: TrackElementType): TrackSegment => {
    // create an array and fill it with the profile for a flat track
    switch (type) {
        case TrackElementType.Down25:
            return down25Track;
        case TrackElementType.LeftVerticalLoop:
            return leftVerticalLoop;
        default:
            return flatTrack;
    }
};

const flatTrack: TrackSegment = {
    type: 0,
    description: '',
    elements: [{
        x: 0,
        y: 0,
        z: 0
    }],
    beginDirection: 0,
    endDirection: 0,
    beginSlope: 0,
    endSlope: 0,
    beginBank: 0,
    endBank: 0,
    beginZ: 0,
    endZ: 0,
    endX: 0,
    endY: 0,
    length: 32,
    nextSuggestedSegment: 'straight',
    previousSuggestedSegment: 'straight',
    mirrorSegment: 0,
    alternateTypeSegment: 68,
    priceModifier: 65536,
    trackGroup: 0,
    turnDirection: 'straight',
    slopeDirection: 'flat',
    onlyAllowedUnderwater: false,
    onlyAllowedAboveGround: false,
    allowsChainLift: true,
    isBanked: false,
    isInversion: false,
    isSteepUp: false,
    startsHalfHeightUp: false,
    countsAsInversion: false,
    isBankedTurn: false,
    isSlopedTurn: false,
    isHelix: false,
    countsAsGolfHole: false,
    getSubpositionLength: () => { return 0; },
    getSubpositions: () => { return []; },
};

const down25Track: TrackSegment = {
    type: 10,
    description: '',
    elements: [{
        x: 0,
        y: 0,
        z: 0
    }],
    beginDirection: 0,
    endDirection: 0,
    beginSlope: 6,
    endSlope: 6,
    beginBank: 0,
    endBank: 0,
    beginZ: 16,
    endZ: 0,
    endX: 0,
    endY: 0,
    length: 33,
    nextSuggestedSegment: 'straight',
    previousSuggestedSegment: 'straight',
    mirrorSegment: 10,
    alternateTypeSegment: 75,
    priceModifier: 79872,
    trackGroup: 0,
    turnDirection: 'straight',
    slopeDirection: 'down',
    onlyAllowedUnderwater: false,
    onlyAllowedAboveGround: false,
    allowsChainLift: true,
    isBanked: false,
    isInversion: false,
    isSteepUp: false,
    startsHalfHeightUp: true,
    countsAsInversion: false,
    isBankedTurn: false,
    isSlopedTurn: false,
    isHelix: false,
    countsAsGolfHole: false,
    getSubpositionLength: () => { return 0; },
    getSubpositions: () => { return []; },
};


const leftVerticalLoop: TrackSegment = {
    type: 40,
    description: 'Vertical Loop (left)',
    elements:
        [{
            x: 0,
            y: 0,
            z: 0
        },
        {
            x: -32.000000,
            y: 0,
            z: 16
        },
        {
            x: -64.000000,
            y: 0,
            z: 32
        },
        {
            x: -32.000000,
            y: 0,
            z: 120
        }],
    beginDirection: 0,
    endDirection: 0,
    beginSlope: 2,
    endSlope: 6,
    beginBank: 0,
    endBank: 0,
    beginZ: 0,
    endZ: 0,
    endX: -32.000000,
    endY: -32.000000,
    length: 120,
    nextSuggestedSegment: 'straight',
    previousSuggestedSegment: 'straight',
    mirrorSegment: 41,
    alternateTypeSegment: null,
    priceModifier: 491520,
    trackGroup: 7,
    turnDirection: 'straight',
    slopeDirection: 'flat',
    onlyAllowedUnderwater: false,
    onlyAllowedAboveGround: false,
    allowsChainLift: false,
    isBanked: false,
    isInversion: true,
    isSteepUp: false,
    startsHalfHeightUp: true,
    countsAsInversion: true,
    isBankedTurn: false,
    isSlopedTurn: false,
    isHelix: false,
    countsAsGolfHole: false,
    getSubpositionLength: () => { return 0; },
    getSubpositions: () => { return []; },
};

