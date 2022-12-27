import { RideType } from "../../utilities/rideType";
import { TrackElementType } from "../../utilities/trackElementType";
import { Store, store, compute } from "openrct2-flexui";
import { GlobalStateController } from "./GlobalStateController";
import { computeBuildLocation } from "../../services/computeBuildLocation";
import { debug } from "../../utilities/logger";

type WorkingBuildState = {
    rideType: RideType | null;
    ride: number | null;
    trackElementType: TrackElementType | null;
    initialBuildLocation: CoordsXYZD | null;
    computedBuildLocation: CoordsXYZD | null;
};

type FinishedBuildState = {
    rideType: RideType;
    ride: number;
    trackElementType: TrackElementType;
    computedBuildLocation: CoordsXYZD;
};

export type BuildState = WorkingBuildState | FinishedBuildState;

const isFinishedBuildState = (buildState: BuildState): buildState is FinishedBuildState => {
    return buildState.rideType != null && buildState.ride != null && buildState.trackElementType != null && buildState.computedBuildLocation != null;
};

/**
 * This class is responsible for keeping track of the state of the build process.
 * There are 4 props that need values in order to build:
 * 1. rideType
 * 2. ride
 * 3. trackElementType
 * 4. the build location
 *
 */
export class BuildStateController {

    /**
     * The global state controller is used to get the build direction.
     */
    private readonly _globalState: GlobalStateController;

    /**
     * The ride type that the user has selected to build.
     */
    readonly rideType: Store<RideType | null> = store<RideType | null>(null);

    /**
     * The ride that the user has selected to build a new track element onto.
    */
    readonly ride: Store<number | null> = store<number | null>(null);

    /**
     * The track element type that the user has selected to build.
     */
    readonly trackElementType: Store<TrackElementType | null> = store<TrackElementType | null>(null);

    /**
     * The build location which the TI says a new track should be placed to build it properly. This store's value gets computed upon change and the new value is stored in a private computedBuildLocation store.
     */
    readonly initialBuildLocation: Store<CoordsXYZD | null> = store<CoordsXYZD | null>(null);
    /**
     * Location after considering building forward/backward, inverted, up vs down, etc.
     * This may or may not be the same as the initialBuildLocation.
    */
    private readonly computedBuildLocation: Store<CoordsXYZD | null> = store<CoordsXYZD | null>(null);

    /**
     * The finished build state is the build state holds either a finished build state or null (representing a non-complete build).
     */
    readonly finishedBuildState: Store<FinishedBuildState | null> = compute((this.rideType, this.ride, this.trackElementType, this.computedBuildLocation), () => {
        return this.getFinishedBuildState();
    });

    private getFinishedBuildState(): FinishedBuildState | null {
        const buildState = this.getBuildState();
        if (isFinishedBuildState(buildState)) {
            return buildState;
        }
        return null;
    }

    constructor(globalState: GlobalStateController) {
        this._globalState = globalState;

        // this._globalState.buildDirection.subscribe(newBuildDirection => this.onBuildDirectionChange(newBuildDirection));
        // this.rideType.subscribe(newRideType => this.onRideTypeChange(newRideType));
        // this.ride.subscribe(newRide => this.onRideChange(newRide));
        // this.trackElementType.subscribe(newTrackElementType => this.onTrackElementTypeChange(newTrackElementType));
        // this.initialBuildLocation.subscribe(newInitialBuildLocation => this.onInitialBuildLocationChange(newInitialBuildLocation));
        // this.computedBuildLocation.subscribe(newComputedBuildLocation => this.onComputedBuildLocationChange(newComputedBuildLocation));

        this.computedBuildLocation = compute((this._globalState.buildDirection, this.initialBuildLocation, this.trackElementType), () => {
            return this.computeBuildLocation();
        });
    }

    public getBuildState(): BuildState {
        const buildState: BuildState = {
            rideType: this.rideType.get(),
            ride: this.ride.get(),
            trackElementType: this.trackElementType.get(),
            initialBuildLocation: this.initialBuildLocation.get(),
            computedBuildLocation: this.computedBuildLocation.get()
        };
        if (isFinishedBuildState(buildState)) {
            return buildState;
        }
        return buildState;
    }

    private computeBuildLocation(): CoordsXYZD | null {
        const { buildDirection: buildDirectionStore } = this._globalState;
        // need to get buildDirection, initialBuildLocation, trackElementType as values

        const buildDirection = buildDirectionStore.get();
        const initialLocation = this.initialBuildLocation.get();
        const trackElementType = this.trackElementType.get();

        if (buildDirection == null || initialLocation == null || trackElementType == null) {
            debug("BuildStateController.computeBuildLocation: one of the required values is null");
            return null;
        }

        const newBuildLocation = computeBuildLocation({
            buildDirection,
            initialLocation,
            trackElementType
        });
        return newBuildLocation;
    }
}

const buildStateController = new BuildStateController(new GlobalStateController);
buildStateController.finishedBuildState.subscribe((finishedBuildState) => {
    if (finishedBuildState != null) {
        debug(`finishedBuildState: ${JSON.stringify(finishedBuildState)}`);
    }
});




