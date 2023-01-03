import { SegmentSequencer } from './../segments/SegmentSequence';
import { ButtonStateController } from './ButtonStateController';
import { BuildStateController } from './BuiltStateController';
import { Store, store } from 'openrct2-flexui';


export class GlobalStateController {

    buildDirection: Store<BuildDirection | null> = store<BuildDirection | null>(null);
    buildState: BuildStateController;
    buttonState: ButtonStateController;
    segmentState: SegmentSequencer;

    constructor() {
        this.buildState = new BuildStateController(this);
        this.buttonState = new ButtonStateController();
        this.segmentState = new SegmentSequencer();
    }
}
