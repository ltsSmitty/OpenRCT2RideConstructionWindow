
import { Segment } from "./Segment";
import { debug } from "~/src/utilities/logger";
import * as finder from "~/src/services/finder";
import { TrackElementType } from "~/src/utilities/trackElementType";
import _ from "lodash-es";
import { arrayStore, store, Store, ArrayStore, compute } from "openrct2-flexui";
import { GlobalStateController } from "../global/GlobalStateController";

/** Keep track of the selected segment, the sequence it's in, and whether or not it's a complete circuit. */
class SegmentState {
    /**
    * The selected sequence of segments in a row
    */
    readonly segmentSequence: ArrayStore<Segment> = arrayStore<Segment>([]);

    /**
     * The index in segments of the currenlty selected segment
     */
    readonly selectedSegmentIndex: Store<number> = store<number>(-1);

    /**
     * The currently selected segment, dependant on the sequence and the selected index
     */
    readonly selectedSegment: Store<Segment | null> = compute(this.segmentSequence, this.selectedSegmentIndex, (sequence, index) => getSelectedSegmentFromIndex(sequence, index));

    /**
     *Whether the sequence of segments is a complete circuit
     */
    readonly isCompleteCircuit: Store<boolean> = compute(this.segmentSequence, (sequence) => checkIsCompleteCircuit(sequence));

    /**
    * Get a sequence of segments which are iterable from the initial segment. The sequence will link together segments before and after the selected segment.
    */
    private createSegmentSequence(initialSegment: Segment | null): Segment[] {
        if (initialSegment == null) {
            debug("Initial segment invalid: null");
            return [];
        }

        const segments = [initialSegment];

        // iterate through backwards with a TI
        // get the TI for iterating
        const reverseIterator = finder.getTIAtSegment({ segment: initialSegment });
        if (reverseIterator == null) {
            debug("Initial segment invalid: no TI found");
            return [];
        }

        // get a separate iterator to move forward
        const forwardIterator = { ...reverseIterator };

        // Loop backwards until we find a begin station or an end
        while (reverseIterator.previousPosition) {
            reverseIterator.previous();
            const newSegment: Segment = new Segment({
                location: reverseIterator.position,
                ride: initialSegment.ride,
                trackType: reverseIterator.segment?.type ?? 0,
                rideType: finder.getTrackElementFromSegment({ ride: initialSegment.ride, location: reverseIterator.position, trackType: -1, rideType: -1 })?.element.rideType ?? -1
            });
            segments.unshift(newSegment);

            if (newSegment.trackType == TrackElementType.BeginStation) {
                break;
            }
        }
        // set the selected index to the original one we chose
        // hopefuly this isn't out of bounds
        // this sets the selected segment to this as well due to the subscription
        this.selectedSegmentIndex.set(segments.length - 1);

        // Loop forwards until we find the same beginStation or an end
        while (forwardIterator.nextPosition) {
            forwardIterator.next();
            const newSegment: Segment = new Segment({
                location: forwardIterator.position,
                ride: initialSegment.ride,
                trackType: forwardIterator.segment?.type ?? 0,
                rideType: finder.getTrackElementFromSegment({ ride: initialSegment.ride, location: forwardIterator.position, trackType: -1, rideType: -1 })?.element.rideType ?? -1
            });
            segments.push(newSegment);

            if (newSegment.trackType == TrackElementType.BeginStation) {
                break;
            }
        }

        return segments;
    }

    /** Update the segmentSequence state by providing a new segment to be the new selected segment. */
    public updateSegmentSequence(initialSegment: Segment | null): void {
        // this actually sets all the state values
        const newSequence = this.createSegmentSequence(initialSegment);
        debug(`sequence updated with ${newSequence.length} segments, with selected index ${this.selectedSegmentIndex.get()}`);
        this.segmentSequence.set(newSequence);
    }

    /** Set the selected segment to the index provided.
     * If the index is out of bounds, it will check for a complete circuit, and return either the 0th or last element.
     * E.g. If given -5 for the index and is complete circuit, will still return the last index, not the (last - 5th). */
    private setSelectedSegment({ index }: { index: number }): Segment | null {
        const segments = this.segmentSequence.get();

        // see if it should wrap around backwards
        if (index < 0 && this.isCompleteCircuit) {
            // don't fully wrap, just wrap to the last element
            // this also sets the selected segment
            this.selectedSegmentIndex.set(segments.length - 1);
            return this.selectedSegment.get();
        }
        // see if it should wrap around forwards
        if (index >= segments.length && this.isCompleteCircuit) {
            // don't fully wrap, just wrap to the first element
            this.selectedSegmentIndex.set(0);
            return this.selectedSegment.get();
        }
        // check for otherwise out of bound indices
        if (index < 0 || index >= segments.length && !this.isCompleteCircuit) {
            debug("SegmentSequence.setSelectedSegment: index out of bounds");
            return null;
        }
        // set the new index and selected segment
        this.selectedSegmentIndex.set(index);
        return this.selectedSegment.get();
    }

    /**
    * Check if the selectedSegment from the segment sequence state has a proceeding segment in the next direction
    */
    public hasNext(): boolean {
        return (this.selectedSegmentIndex.get() < this.segmentSequence.get().length - 1) || this.isCompleteCircuit.get();
    }

    /**
   * Check if the selectedSegment from the segment sequence state has a proceeding segment in the previous direction
   */
    public hasPrevious(): boolean {
        return (this.selectedSegmentIndex.get() > 0) || this.isCompleteCircuit.get();
    }

    /** Iterate the selected segment in the direction provided. Returns true if it successfully iterates, returns false if it's unable to iterate.*/
    public iterateSelectionInDirection(direction: BuildDirection): boolean {
        if (direction === "next") {
            //return true if successful
            debug("SegmentSequence.iterateSelectionInDirection: next");
            return !!this.setSelectedSegment({ index: this.selectedSegmentIndex.get() + 1 });
        }
        // direction === "previous"
        debug("SegmentSequence.iterateSelectionInDirection: previous");
        return !!this.setSelectedSegment({ index: this.selectedSegmentIndex.get() - 1 });
    }
    /**
     * Get the initial build location which a TI provides at the end of the segment sequence in the direction provided.
     * This location will need to be normalized to deal with track element type factors (e.g. segment sloped down, helixes, etc.)
     */
    public getBuildLocation({ direction }: { direction: BuildDirection | null }): CoordsXYZD | null {
        if (direction == null) {
            debug("SegmentSequence.getBuildLocation: direction is null");
            return null;
        }
        const segments = this.segmentSequence.get();
        if (direction == "next") {
            // get the last value in segments, then get a TI there and get nextPosition()
            const finalSegment = segments[segments.length - 1];
            const finalSegmentTI = finder.getTIAtSegment(finalSegment);
            if (finalSegmentTI == null) {
                debug(`SegmentSequence.getBuildLocation ${direction}: no TI found`);
                return null;
            }
            return finalSegmentTI.nextPosition;
        }
        // in the previous direction, get the 0th element and the previousPosition
        // get the first value in segments, then get a TI there and get previousPosition()
        const firstSegment = segments[0];
        const firstSegmentTI = finder.getTIAtSegment(firstSegment);
        if (firstSegmentTI == null) {
            debug(`SegmentSequence.getBuildLocation ${direction}: no TI found`);
            return null;
        }
        return firstSegmentTI.previousPosition;
    }
}

class SegmentModel {
    private readonly globalState: GlobalStateController;
    readonly segmentState: SegmentState;


    /** When a segment is selected, temporarily store the list of track elements here for future reference */
    readonly trackElementsOnSelectedTile: ArrayStore<TrackElementItem> = arrayStore<TrackElementItem>([]);

    constructor(globalState: GlobalStateController) {
        this.globalState = globalState;
        this.segmentState = new SegmentState();
        // adding this debug just to make eslint happy about globalState not being used. if it ends up never being used, feel free to delete this.
        debug(`segmentModel initialized with globalState having ${JSON.stringify(Object.keys(this.globalState).length)} keys`);
    }
}



const areSegmentsEqual = (segment1: Segment, segment2: Segment): boolean => {
    return _.isEqual(segment1.location, segment2.location) && segment1.ride == segment2.ride && segment1.trackType == segment2.trackType;
};

const checkIsCompleteCircuit = (segmentSequence: Segment[]): boolean => {
    const firstSegment = segmentSequence[0];
    const lastSegment = segmentSequence[segmentSequence.length - 1];

    const TIAtFirstSegment = finder.getTIAtSegment(firstSegment);
    if (TIAtFirstSegment == null) {
        debug("SegmentSequence.checkIsCompleteCircuit: no TI found at first segment");
        return false;
    }
    // check if the last segment is the same as the first segment and that they're not undefined
    if (_.isEqual(TIAtFirstSegment?.previousPosition, lastSegment.location) && lastSegment.location) {
        return true;
    }
    return false;
};

const getSelectedSegmentFromIndex = (segmentSequence: Segment[], selectedSegmentIndex: number): Segment | null => {
    if (selectedSegmentIndex < 0 || selectedSegmentIndex >= segmentSequence.length) {
        debug("SegmentSequence.getSelectedSegmentFromIndex: selectedSegmentIndex out of bounds");
        return null;
    }
    return segmentSequence[selectedSegmentIndex];
};

export {
    SegmentState,
    SegmentModel,
    areSegmentsEqual,
};
