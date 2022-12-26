/* eslint-disable @typescript-eslint/no-empty-function */
import { TrackElementType } from './src/utilities/trackElementType';
import { createMockStaff, createMockTrackSegment } from './testUtils';

function mockGetAllEntities(type: EntityType): Entity[];
function mockGetAllEntities(type: 'guest'): Guest[];
function mockGetAllEntities(type: 'staff'): Staff[];
function mockGetAllEntities(type: 'car'): Car[];
function mockGetAllEntities(type: 'litter'): Litter[];
function mockGetAllEntities(): Entity[] {
    return [
        createMockStaff('handyman'),
        createMockStaff('handyman'),
        createMockStaff('handyman'),
        createMockStaff('handyman'),
        createMockStaff('handyman'),
        createMockStaff('entertainer'),
        createMockStaff('entertainer'),
        createMockStaff('entertainer'),
        createMockStaff('security'),
        createMockStaff('security'),
        createMockStaff('mechanic'),
        createMockStaff('mechanic'),
        createMockStaff('mechanic'),
        createMockStaff('mechanic'),
    ];
}

global.map = { getAllEntities: mockGetAllEntities } as GameMap;

function mockGetTrackSegment(type: number): TrackSegment;
function mockGetTrackSegment(type: TrackElementType): TrackSegment {
    return createMockTrackSegment(type);
}

global.context = { getTrackSegment: mockGetTrackSegment } as Context;
