
import { Segment } from "./Segment";
import { debug } from "~/src/utilities/logger";
import * as finder from "~/src/services/finder";
import { TrackElementType } from "~/src/utilities/trackElementType";
import _ from "lodash-es";

export class SegmentSequence {
    private _initialSegment: Segment | null = null;
    private _segments: Segment[] = [];
    private _selectedSegmentIndex = -1;
    isCompleteCiruit = false;

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

    createSequence(): void {
        if (this._initialSegment == null) {
            debug("SegmentSequence.createSequence: no initial segment");
            return;
        }
        this._segments = [this._initialSegment];

        // loop through with a TI
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

    getSegmentIndex(segment: Segment): number {
        return _.findIndex(this._segments, s => _.isEqual(s.location, segment.location));
    }
}

export class SegmentSequencer {
    private _segmentSequence: SegmentSequence = new SegmentSequence();

    get segmentSequence(): SegmentSequence {
        return this._segmentSequence;
    }

    createSequenceFrom(segment: Segment): this {
        this._segmentSequence = new SegmentSequence(segment);
        return this;
    }

    // when a new segment has been selected in the UI, 1. get a ti, 2. move backwards to a stationStart TET (or an end), then move forward until an end or the same stationStart TET is found
}


