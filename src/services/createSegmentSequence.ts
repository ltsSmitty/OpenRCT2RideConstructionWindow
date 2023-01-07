import { debug } from "../utilities/logger";
import * as finder from "../services/finder";
import { Segment } from "../objects/segments/Segment";
import { TrackElementType } from "../utilities/trackElementType";
import _ from "lodash-es";

type SequenceResult = {
    sequence: Segment[],
    indexOfInitialSegment: number,
    isCircuit: boolean
};

const createRawSegmentSequence = ({ segment }: { segment: Segment }): SequenceResult => {
    const initialSegment = segment;
    const sequence: Segment[] = [initialSegment];
    let indexOfInitialSegment = -1;
    let isCircuit = false;

    debug("Creating segment sequence");
    if (initialSegment == null) {
        debug("Initial segment invalid: null");
        return { sequence: [], indexOfInitialSegment, isCircuit };
    }


    // iterate through backwards with a TI. if we find a begin station, save that as a reference
    // get the TI for iterating
    const reverseIterator = finder.getTIAtSegment({ segment: initialSegment });
    if (reverseIterator == null) {
        debug("Initial segment invalid: no TI found");
        return { sequence: [], indexOfInitialSegment, isCircuit };
    }

    // intiailize the first begin station to null
    let firstBeginStation: Segment | null = null;
    let i = 0;
    // Loop backwards until we find a begin station or an end
    while (reverseIterator.previous() || i > 2000) {
        debug(`Moving backwards, loop ${i}`);
        const newSegment: Segment = new Segment({
            location: reverseIterator.position,
            ride: initialSegment.ride,
            trackType: reverseIterator.segment?.type ?? 0,
            rideType: finder.getTrackElementFromSegment({ ride: initialSegment.ride, location: reverseIterator.position, trackType: -1, rideType: -1 })?.element.rideType ?? -1
        });

        // if a begin station is found, check if it matches the first begin station
        // if it does, we've got a coomplete circuit
        if (newSegment.trackType == TrackElementType.BeginStation) {
            debug(`Found begin station.`);
            if (firstBeginStation == null) {
                debug(`First begin station found, saving as reference`);
                firstBeginStation = newSegment;
            } else {
                debug(`Another BeginStation found, checking if it matches`);
                if (areSegmentsEqual(firstBeginStation, newSegment)) {

                    // at this point the entire track has been created. ready to return.
                    debug(`Complete circuit found, returning`);
                    isCircuit = true;
                    return { sequence, indexOfInitialSegment: sequence.length - 1, isCircuit };
                }
                else {
                    debug(`Begin stations don't match, adding to sequence`);
                }
            }
        }
        // add the new segment to the front of the array
        sequence.unshift(newSegment);
        i++;
    }

    // if we get this far, that means it is not a circuit. so just loop forward until next is false.
    // now that we're done unshifting, we can set the index of the initial segment
    // everything after this will push onto the array.
    indexOfInitialSegment = sequence.length - 1;


    // get a separate iterator to move forward
    const forwardIterator = finder.getTIAtSegment({ segment: initialSegment });
    if (forwardIterator == null) {
        debug("Initial segment invalid: no TI found");
        return { sequence: [], indexOfInitialSegment, isCircuit };
    }
    // Loop forwards until we find the same beginStation or an end
    debug(`about to start looping forwards, loop ${i}`);
    while (forwardIterator.next() && i < 200) {
        debug(`Moving forwards, loop ${i}`);
        const newSegment: Segment = new Segment({
            location: forwardIterator.position,
            ride: initialSegment.ride,
            trackType: forwardIterator.segment?.type ?? 0,
            rideType: finder.getTrackElementFromSegment({ ride: initialSegment.ride, location: forwardIterator.position, trackType: -1, rideType: -1 })?.element.rideType ?? -1
        });
        sequence.push(newSegment);
        i++;
    }

    return { sequence, indexOfInitialSegment, isCircuit };
};

/** Shift a circuitous sequence so that it's first elemeent is a BeginStation. If the sequence is not a circuit or doesn't have a BeginStation, return the original SequenceResult. */
const setRawCircuitSequenceToBeginAtStation = ({ sequenceResult }: { sequenceResult: SequenceResult }): SequenceResult => {
    // go through the sequenceResult.sequence until it finds the first index of a begin station, and then shift all the elements to the left until that index is 0
    // then return the new sequenceResult
    const { sequence, indexOfInitialSegment, isCircuit } = sequenceResult;
    if (!isCircuit) {
        return sequenceResult;
    }
    const indexOfFirstBeginStation = _.findIndex(sequence, (segment) => segment.trackType == TrackElementType.BeginStation);
    if (indexOfFirstBeginStation == -1) {
        return sequenceResult;
    }
    const newSequence = sequence.slice(indexOfFirstBeginStation).concat(sequence.slice(0, indexOfFirstBeginStation));
    // account for the selected segment potentially being before the BeginStation. if it is, we need to add the length of the sequence to the index
    const newSelectedSegmentIndex = indexOfInitialSegment - indexOfFirstBeginStation > 0 ? indexOfInitialSegment - indexOfFirstBeginStation : newSequence.length + (indexOfInitialSegment - indexOfFirstBeginStation);

    return { sequence: newSequence, indexOfInitialSegment: newSelectedSegmentIndex, isCircuit };
};

const areSegmentsEqual = (segment1: Segment, segment2: Segment): boolean => {
    return _.isEqual(segment1.location, segment2.location) && segment1.ride == segment2.ride && segment1.trackType == segment2.trackType;
};

/** Create a segment sequence from a given initial segment.
 * If the ride forms a complete circuit, this will return a sequence beginning at a BeginStation.
 * The index of the initial segment is returned in the return object so it doesn't need to searched for later.
 * */
const createSegmentSequence = (initialSegment: Segment | null): SequenceResult => {
    if (initialSegment == null) {
        return { sequence: [], indexOfInitialSegment: -1, isCircuit: false };
    }
    const rawSequenceResult = createRawSegmentSequence({ segment: initialSegment });
    return setRawCircuitSequenceToBeginAtStation({ sequenceResult: rawSequenceResult });
};

export default createSegmentSequence;
