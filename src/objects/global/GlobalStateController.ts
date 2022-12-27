import { BuildStateController } from './BuiltStateController';
import { Store, store } from 'openrct2-flexui';


export class GlobalStateController {

    buildDirection: Store<BuildDirection | null> = store<BuildDirection | null>(null);
    buildState: BuildStateController;

    constructor() {
        this.buildState = new BuildStateController(this);
    }
}
