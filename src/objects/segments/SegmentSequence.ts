
import { Segment } from "./Segment";
import { debug } from "~/src/utilities/logger";
import * as finder from "~/src/services/finder";
import { TrackElementType } from "~/src/utilities/trackElementType";
import _ from "lodash-es";
import { Store, store } from "openrct2-flexui";

export class SegmentSequence {
    private _initialSegment: Segment | null = null;
    private _segments: Segment[] = [];
    private _selectedSegmentIndex = -1;
    isCompleteCiruit = false;
    public nextBuildLocation: Store<CoordsXYZD | null> = store<CoordsXYZD | null>(null);
    public previousBuildLocation: Store<CoordsXYZD | null> = store<CoordsXYZD | null>(null);

    getNextBuildLocation(): CoordsXYZD | null {
        // get the last value in segments, then get a TI there and get nextLocation()
        const finalSegment = this._segments[this._segments.length - 1];
        if (!finalSegment) return null;
        const tiAtEnd = finder.getTIAtSegment(finalSegment);
        if (!tiAtEnd) return null;
        return tiAtEnd.nextPosition;
    }

    constructor(segment?: Segment) {
        this._initialSegment = segment ?? null;
        this.createSequence();
    }

    get segments(): Segment[] {
        return this._segments;
    }

    get selectedSegment(): Segment | null {
        return this._segments[this._selectedSegmentIndex] ?? null;
    }

    getSegmentAtIndex(index: number): Segment | null {
        if (index < 0 || index >= this._segments.length) {
            debug(`SegmentSequence.getSegmentAtIndex: index ${index} out of range`);
            return null;
        }
        return this._segments[index] ?? null;
    }

    hasNextSegment(): boolean {
        return this._segments[this._selectedSegmentIndex + 1] ? true : false;
    }

    hasPreviousSegment(): boolean {
        return this._segments[this._selectedSegmentIndex - 1] ? true : false;
    }

    next(): boolean {
        if (!this.hasNextSegment()) return false;
        this._selectedSegmentIndex++;
        return true;
    }

    previous(): boolean {
        if (!this.hasPreviousSegment()) return false;
        this._selectedSegmentIndex--;
        return true;
    }

    private createSequence(): void {
        if (this._initialSegment == null) {
            debug("SegmentSequence.createSequence: no initial segment");
            return;
        }
        this._segments = [this._initialSegment];

        // iterate through backwards with a TI
        const reverseIterator = finder.getTIAtSegment(this._initialSegment);
        if (reverseIterator == null) {
            debug("Initial segment invalid: no TI found");
            this._initialSegment = null;
            return;
        }
        // get a separate iterator to move forward
        const forwardIterator = { ...reverseIterator };

        // Loop backwards until we find a begin station or an end

        // let i = 0;
        // const max = 2000;
        // while (newTI.previousPosition && i < max) {
        while (reverseIterator.previousPosition) {
            reverseIterator.previous();
            const newSegment: Segment = new Segment({
                location: reverseIterator.position,
                ride: this._initialSegment.ride,
                trackType: reverseIterator.segment?.type ?? 0,
                rideType: this._initialSegment.rideType
            });
            this._segments.unshift(newSegment);
            // i++;

            if (newSegment.trackType == TrackElementType.BeginStation) {
                break;
            }
        }
        // set the selected index to the original one we chose
        // hopefuly this isn't out of bounds
        this._selectedSegmentIndex = this._segments.length - 1;

        // Loop forwards until we find the same beginStation or an end
        while (forwardIterator.nextPosition) {
            forwardIterator.next();
            const newSegment: Segment = new Segment({
                location: forwardIterator.position,
                ride: this._initialSegment.ride,
                trackType: forwardIterator.segment?.type ?? 0,
                rideType: this._initialSegment.rideType
            });

            // break if we get to an the original beginStation
            if (newSegment.trackType === TrackElementType.BeginStation && _.isEqual(newSegment, this._segments[0].location)) {
                break;
            }

            // as long as it doesn't match, push it on.
            this._segments.push(newSegment);
        }
    }

    private updateSequence(): void {
        // do the same process as createSequence, making sure there's no duplicates,
        // this is to be called after building a new segment, to add it onto this sequence.
        debug(`ERROR: update sequence not implemented.`, true);
    }

    getSegmentIndex(segment: Segment): number {
        return _.findIndex(this._segments, s => _.isEqual(s.location, segment.location));
    }

    /**
     * After construcrting a new segment, add it to the sequence
     */
    addNewlyBuiltSegment(): void {
        // check if the segment's location is
        const lastSegment = this._segments[this._segments.length - 1];
        const TIAtLastSegment = finder.getTIAtSegment(lastSegment);
        if (TIAtLastSegment?.next()) {
            this.updateSequence();
        }
    }
}

export class SegmentSequencer {
    private _segmentSequence: SegmentSequence = new SegmentSequence();

    get segmentSequence(): SegmentSequence {
        return this._segmentSequence;
    }

    createSequenceFrom(segment: Segment): SegmentSequence {
        this._segmentSequence = new SegmentSequence(segment);
        return this.segmentSequence;
    }

    // when a new segment has been selected in the UI, 1. get a ti, 2. move backwards to a stationStart TET (or an end), then move forward until an end or the same stationStart TET is found
}


