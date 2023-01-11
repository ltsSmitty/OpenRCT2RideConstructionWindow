/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { debug } from '../../utilities/logger';
import { TrackElementType } from '../../utilities/trackElementType';

/**
 * Use to compare a first and second TrackElementTypeto see if they are compatible.
 * To go in the previous direction, just swap which is first and which is second.
 */
const areSegmentsCompatible = (initialTrackElement: TrackElementType, finalTrackElement: TrackElementType): boolean => {
    const initial = context.getTrackSegment(Number(initialTrackElement));
    const final = context.getTrackSegment(Number(finalTrackElement));
    const slopesMatch = initial?.endSlope == final?.beginSlope;
    const banksMatch = initial?.endBank == final?.beginBank;
    const diagonalsMatch = Number(initial?.endDirection) == Number(final?.beginDirection);

    // debug(`Checking compatability of ${TrackElementType[initialTrackElement]} into ${TrackElementType[finalTrackElement]}: ${slopesMatch && banksMatch && diagonalsMatch}`);
    return slopesMatch && banksMatch && diagonalsMatch;
};

/** Get the (hopefully only one) buildable segments that are valid based on the initial segment, the list of all currently available TETs, and build direction, */
export const getBuildableSegments = ({ initialTrackElement, trackElementOptions, direction }: {
    initialTrackElement: TrackElementType | null,
    trackElementOptions: TrackElementType[],
    direction: 'next' | 'previous' | null
}
): TrackElementType[] => {
    if (initialTrackElement == null || direction == null) {
        debug(`initialTrackElement or direction is null, returning empty array`);
        return [];
    }

    // swap the order of elements depending on next vs previous
    if (direction == 'next') {
        const buildableSegments = trackElementOptions.filter((el) => {
            return areSegmentsCompatible(initialTrackElement, el);
        });
        return buildableSegments;
    }
    if (direction == 'previous') {
        const buildableSegments = trackElementOptions.filter((el) => {
            return areSegmentsCompatible(el, initialTrackElement);
        });
        return buildableSegments;
    }
    return [];
};

