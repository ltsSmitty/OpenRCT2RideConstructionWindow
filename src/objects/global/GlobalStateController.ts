import * as SegmentSequence from "src/objects/segments/SegmentSequence";
import { ButtonStateController } from './ButtonStateController';
import { BuildStateController } from './BuiltStateController';
import { Store, store } from 'openrct2-flexui';


export class GlobalStateController {

    readonly buildDirection: Store<BuildDirection | null> = store<BuildDirection | null>(null);
    buildState: BuildStateController;
    buttonState: ButtonStateController;
    readonly segmentModel: SegmentSequence.SegmentModel;

    constructor() {
        this.buildState = new BuildStateController(this);
        this.buttonState = new ButtonStateController();
        this.segmentModel = new SegmentSequence.SegmentModel(this);
    }
}

