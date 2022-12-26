import { TrackElementType } from './../utilities/trackElementType';
import { createMockStaff } from '~/testUtils';
import * as utils from '../utils';
import { computeBuildLocation } from '../services/computeBuildLocation';

describe('utils', () => {
    describe('isHandyman', () => {
        it('returns true if staff member is a handyman', () => {
            expect(utils.isHandyman(createMockStaff('handyman'))).toBe(true);
        });
    });

    describe('isMechanic', () => {
        it('returns true if staff member is a mechanic', () => {
            expect(utils.isMechanic(createMockStaff('mechanic'))).toBe(true);
        });
    });

    describe('isSecurity', () => {
        it('returns true if staff member is a security guard', () => {
            expect(utils.isSecurity(createMockStaff('security'))).toBe(true);
        });
    });

    describe('isEntertainer', () => {
        it('returns true if staff member is an entertainer', () => {
            expect(utils.isEntertainer(createMockStaff('entertainer'))).toBe(true);
        });
    });

    describe('getHandymen', () => {
        it('returns all handymen in the park', () => {
            const result = utils.getHandymen();

            expect(result).toHaveLength(5);
            expect(result.every((entity) => entity.staffType === 'handyman')).toBe(true);
        });
    });

    describe('getMechanics', () => {
        it('returns all mechanic in the park', () => {
            const result = utils.getMechanics();

            expect(result).toHaveLength(4);
            expect(result.every((entity) => entity.staffType === 'mechanic')).toBe(true);
        });
    });

    describe('getSecurity', () => {
        it('returns all security guards in the park', () => {
            const result = utils.getSecurity();

            expect(result).toHaveLength(2);
            expect(result.every((entity) => entity.staffType === 'security')).toBe(true);
        });
    });

    describe('getEntertainers', () => {
        it('returns all entertainers in the park', () => {
            const result = utils.getEntertainers();

            expect(result).toHaveLength(3);
            expect(result.every((entity) => entity.staffType === 'entertainer')).toBe(true);
        });
    });
});

const flatBuildLocation: Parameters<typeof computeBuildLocation> = [{
    initialLocation: { x: 0, y: 0, z: 0, direction: 0 },
    buildDirection: "next",
    trackElementType: TrackElementType.Flat
}];

const down25BuildLocation: Parameters<typeof computeBuildLocation> = [{
    initialLocation: { x: 0, y: 0, z: 0, direction: 0 },
    buildDirection: "next",
    trackElementType: TrackElementType.Down25
}];

const leftVerticalLoopBuildLocation: Parameters<typeof computeBuildLocation> = [{
    initialLocation: { x: 0, y: 0, z: 0, direction: 0 },
    buildDirection: "next",
    trackElementType: TrackElementType.LeftVerticalLoop
}];


describe('computeBuildLocation_FlatTrackSegment', () => {
    it('gets the TrackSegment details for Flat track element type', () => {
        const result = computeBuildLocation(...flatBuildLocation);
        expect(result).toStrictEqual(flatBuildLocation[0].initialLocation);
    });
});

describe('computeBuildLocation_Down25TrackSegment', () => {
    it('gets the TrackSegment details for down25 track element type', () => {
        const result = computeBuildLocation(...down25BuildLocation);
        const expectedDownLocation = {
            x: 0,
            y: 0,
            z: -16,
            direction: 0
        };
        expect(result).toStrictEqual(expectedDownLocation);
    });
});

describe('computeBuildLocation_LeftVerticalLoopTrackSegment', () => {
    it('gets the TrackSegment details for leftVerticalLoop track element type', () => {
        const expectedLeftVerticalLoopLocation = {
            x: 32,
            y: 32,
            z: 0,
            direction: 0
        };
        const result = computeBuildLocation(...leftVerticalLoopBuildLocation);
        expect(result).toStrictEqual(expectedLeftVerticalLoopLocation);
    });
});

describe('computeBuildLocation_LeftVerticalLoopTrackSegment, direction1', () => {
    it('gets the TrackSegment details for leftVerticalLoop track element type', () => {
        const expectedLeftVerticalLoopLocation = {
            x: 32,
            y: -32,
            z: 0,
            direction: 1
        };
        const thisLocation = { ...leftVerticalLoopBuildLocation };
        thisLocation[0].initialLocation.direction = 1;
        const result = computeBuildLocation(...leftVerticalLoopBuildLocation);
        expect(result).toStrictEqual(expectedLeftVerticalLoopLocation);
    });
});
