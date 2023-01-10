import { GlobalStateController } from './../global/GlobalStateController';
import { Segment } from "../segments/Segment";
import * as finder from "src/services/finder";
// import * as storage from "../utilities/coldStorage";
import ColourChange from "./colourChange";
import { debug } from "src/utilities/logger";
import { highlightMapRangeUnderSegment } from "./highlightGround";
import { SegmentState } from '../segments/SegmentSequence';

// export type ColourSchemeValue = 0 | 1 | 2 | 3;

// export class SegmentElementPainter {
//     private _isToggled = false;
//     private _initialSegment: Segment | null = null;
//     private _initialTrackColourScheme: 0 | 1 | 2 | 3 | null = null;
//     private _initialColourSchemeValue: TrackColour | null = null;

//     // choose what colour you want to paint the currently selected track
//     // private _selectPaintColour: number = 17
//     private _selectPaintColour: number = Math.floor(Math.random() * 32);

//     clearMemory() {
//         debug(`clearing memory`);
//         this._initialSegment = null;
//         this._initialTrackColourScheme = null;
//         this._initialColourSchemeValue = null;
//         storage.setPaintedSegmentDetails(null, null, null);
//         storage.setPreviewSegment(null);
//         storage.setSelectedSegment(null);
//     }


//     restoreInitialColour(fromColdStorage = false) {
//         if (!this._initialSegment || this._initialTrackColourScheme == null || !this._initialColourSchemeValue) {
//             debug(`Restoring initial colour. No segment/colourSchemes are available from this window session. Attempting to restore from cold storage.`);
//             if (!fromColdStorage) {
//                 this.restoreColoursFromColdStorage();
//             }
//             return;
//         }
//         // get the ride to repaint
//         const thisRide = map.getRide(this._initialSegment.get().ride);

//         const thisElement: TrackElementItem | undefined = finder.getSpecificTrackElement(this._initialSegment.get().ride, this._initialSegment.get().location);

//         if (!thisElement) {
//             debug(`No track element found at ${JSON.stringify(this._initialSegment.get().location)}. Probably the window was closed improperly.`);
//             return;
//         }
//         const elBaseZ = thisElement?.element.baseZ;

//         const { x, y, direction } = this._initialSegment.get().location;
//         const newCoordAttempt = { x, y, z: elBaseZ, direction };

//         // restore the colour scheme
//         const { main, additional, supports } = this._initialColourSchemeValue!;
//         ColourChange.setRideColour(thisRide, main, additional, supports, -1, -1, -1, this._initialTrackColourScheme);
//         ColourChange.setColourSchemeSegment(
//             newCoordAttempt,
//             this._initialSegment.get().trackType,
//             this._initialTrackColourScheme)
//         // (result) => { debug(`Restored the initial track segment colour: ${JSON.stringify(result)}`) });
//     }

//     restoreColoursFromColdStorage(): void {
//         const paintedSegmentDetails = storage.getPaintedSegmentDetails();
//         if (!paintedSegmentDetails) {
//             debug(`No painted segment details found in cold storage.`);
//             return;
//         }
//         const { segment, colourScheme, colourSchemeValue } = paintedSegmentDetails;
//         this._initialSegment = segment;
//         this._initialTrackColourScheme = colourScheme;
//         this._initialColourSchemeValue = colourSchemeValue;
//         debug(`Restored the initial track segment colour from cold storage: ${JSON.stringify(paintedSegmentDetails)}`);
//         this.restoreInitialColour(true);
//     }

//     /**
//      * @Summary paint this segment and unpaint the last segment
//      */
//     public paintSelectedSegment(newSeg: Segment | null): boolean {
//         if (newSeg == null) {
//             return false;
//         }
//         // restore the old selection
//         this.restoreInitialColour();

//         // save the new selection
//         this._initialSegment = newSeg;

//         // need to find the element to get the proper colour scheme
//         const thisRide = map.getRide(newSeg.get().ride);
//         const thisElement = finder.getSpecificTrackElement(newSeg.get().ride, newSeg.get().location)

//         const thisColourScheme = <ColourSchemeValue>thisElement.element.colourScheme || 0;
//         this._initialTrackColourScheme = thisColourScheme;
//         this._initialColourSchemeValue = thisRide.colourSchemes[thisColourScheme];

//         this.paintSegment(newSeg, this._selectPaintColour, this._selectPaintColour, this._selectPaintColour, 3);
//         // debug(`setting painted segment details: ${JSON.stringify(this._initialSegment)}`);
//         storage.setPaintedSegmentDetails(newSeg, thisColourScheme, thisRide.colourSchemes[thisColourScheme]);
//         return true;
//     }

//     private paintSegment(segment: Segment | null, baseColour: number, additionalColour: number, supportsColour: number, schemeNumber: 0 | 1 | 2 | 3): void {
//         if (segment == null) {
//             debug(`segment is null; cannot paint it.`);
//             return;
//         }

//         // need to find the element to get the proper element.baseZ
//         // unfortunately using the segment.location.z doesn't work for some complex pieces like helixes
//         // but this does work
//         const thisRide = map.getRide(segment.get().ride);
//         const thisElement = finder.getSpecificTrackElement(segment.get().ride, segment.get().location);
//         const elBaseZ = thisElement.element.baseZ;

//         const { x, y, direction } = segment.get().location;
//         const newCoordAttempt = { x, y, z: elBaseZ, direction };

//         ColourChange.setRideColour(thisRide, baseColour, additionalColour, supportsColour, -1, -1, -1, schemeNumber);
//         ColourChange.setColourSchemeSegment(newCoordAttempt, segment.get().trackType, schemeNumber,
//             // (result) => { debug(`setColourSchemeSegment returned ${JSON.stringify(result, null, 2)}`); }
//         );
//     }

//     togglePainting(isToggling: boolean): void {
//         if (isToggling) {
//             // context.setInterval(this.toggleToOtherScheme.bind(this), 250);
//         }
//     }

//     private toggleToOtherScheme() {

//         const paintSegmentArgs = {
//             segment: this._initialSegment,
//             baseColour: this._selectPaintColour,
//             additionalColour: this._selectPaintColour,
//             supportsColour: this._selectPaintColour,
//             schemeNumber: <0 | 1 | 2 | 3>3
//         };
//         if (this._isToggled) {
//             this.paintSegment(
//                 paintSegmentArgs.segment,
//                 paintSegmentArgs.baseColour,
//                 paintSegmentArgs.additionalColour,
//                 paintSegmentArgs.supportsColour,
//                 paintSegmentArgs.schemeNumber);
//             this._isToggled = false;
//             return;
//         }
//         this.paintSegment(
//             this._initialSegment,
//             this._initialColourSchemeValue?.main || 0,
//             this._initialColourSchemeValue?.additional || 0,
//             this._initialColourSchemeValue?.supports || 0,
//             this._initialTrackColourScheme || 0);
//         this._isToggled = true;
//         return;
//     }
// }


export class SegmentPainter {

    constructor(segmentState: SegmentState) {
        segmentState.selectedSegment.subscribe((newSeg) => {
            this.highlightRangeUnderSegment({ segment: newSeg });
        });
    }

    public highlightRangeUnderSegment({ segment }: { segment: Segment | null }): void {
        highlightMapRangeUnderSegment({ segment });
    }
}
