
import { GlobalStateController } from '../objects/global/GlobalStateController';
import { BuildStateController } from './../objects/global/BuiltStateController';
// import { debug } from '../utilities/logger';

const globalState = new GlobalStateController();
const buildState = new BuildStateController(globalState);

describe("buildStateController works", () => {
    it("can be constructed", () => {
        expect(buildState).toBeTruthy();
    });
    it("can get build state", () => {
        expect(buildState.getBuildState()).toBeTruthy();
    });
    it("can get finished build state", () => {
        expect(buildState.finishedBuildState.get()).toBeNull();
    });
    it("will update the ride type when buildStateController rideType updates", () => {
        buildState.rideType.set(15);
        expect(buildState.getBuildState().rideType).toBe(15);
    });
    it(`will compute the build location when all build props are set`, () => {
        globalState.buildDirection.set("next");
        buildState.trackElementType.set(99);
        buildState.initialBuildLocation.set({ x: 0, y: 0, z: 0, direction: 0 });
        expect(buildState.getBuildState().computedBuildLocation).toBeTruthy();
    });
    it("will return a finished build state if all required values are set", () => {
        buildState.rideType.set(15);
        buildState.ride.set(0);
        buildState.trackElementType.set(99);
        buildState.initialBuildLocation.set({ x: 0, y: 0, z: 0, direction: 0 });
        expect(buildState.finishedBuildState.get()).toBeTruthy();
    });
});
