import { GlobalStateController } from './../objects/global/GlobalStateController';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { compute, dropdown, groupbox, horizontal, listview, window, WindowTemplate } from "openrct2-flexui";
import { ElementWrapper } from '../viewmodels/elementWrapper';
import { isDevelopment, pluginVersion } from "../environment";
import { TrackElementType } from "../utilities/trackElementType";
// import { debug } from "../utilities/logger";
import buttonActions from '../objects/buttons/buttonActions';
import { customImageFor } from "../objects/customSprites/customButtonSprites";


// const buttonSize = 15;
const directionButtonHeight = 25;
const buttonWidthSmall = 25;
// const buttonWidthMedium = 25;
// const buttonWidthLarge = 18
const directionButtonWidth = 25;
const buttonRowHeight = 30;
const windowWidth = 220;
const windowHeight = 500;
// const controlsWidth = 244;
// const controlsLabelWidth = 82;
// const controlsSpinnerWidth = 146; // controlsWidth - (controlsLabelWidth + 4 + 12); // include spacing
// const clampThenWrapMode: SpinnerWrapMode = "clampThenWrap";

let title = `Advanced Build Menu v${pluginVersion}`;
if (isDevelopment) {
    title += " [DEBUG]";
}

export const trackIteratorWindow = (globalState: GlobalStateController): WindowTemplate => {
    // get all main state variable accessible.
    const { buildDirection, segmentModel: model, buttonState } = globalState;
    const { segmentState } = model;
    const { selectedSegment } = segmentState;

    // create the element wrapper
    const element = new ElementWrapper(globalState);

    return window({
        title,
        width: windowWidth,
        height: windowHeight,
        spacing: 5,
        onOpen: () => {
            // clean up potential issues in case the window crashed or something
            // model.open()
            // if there's nothing already, selected, open the picker tool
            if (selectedSegment.get() == null) {
                // todo actually just force toggle the select toggle
                buttonActions.selectSegment(globalState, true);
            }
        },
        // onUpdate: () => model.update(),
        // onClose: () => model.close(),
        content: [
            // turn banking and steepness
            groupbox({
                // spacing: 5,
                // padding: 2,

                text: "Direction",
                content: [

                    // 7 buttons
                    horizontal({
                        height: buttonRowHeight,
                        content: [
                            element.toggle({
                                buttonType: 'left1Tile',
                                width: buttonWidthSmall,
                                height: directionButtonHeight,
                                image: 5135,// 1 tile left turn
                                // onChange: (isPressed) => { debug(`hi`) }


                            }),
                            element.toggle({
                                buttonType: "left3Tile",
                                width: buttonWidthSmall,
                                height: directionButtonHeight,
                                image: customImageFor("mediumLeftTurn") // 3 tile left turn
                            }),
                            element.toggle({
                                buttonType: "left5Tile",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5133 // 5 tile left turn
                            }),
                            element.toggle({
                                buttonType: "noCurve",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5137 // straight
                            }),
                            element.toggle({
                                buttonType: "right5Tile",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5139	// 5 tile right turn
                            }),
                            element.toggle({
                                buttonType: "right3Tile",
                                width: buttonWidthSmall,
                                height: directionButtonHeight,
                                image: customImageFor("mediumRightTurn") // 3 tile right turn
                            }),
                            element.toggle({
                                buttonType: "right1Tile",
                                width: buttonWidthSmall,
                                height: directionButtonHeight,
                                image: 5136 // 1 tile right turn
                            }),
                        ]
                    }),
                    // large turns and s-bends

                    horizontal({
                        height: buttonRowHeight,
                        content: [
                            element.toggle({
                                buttonType: "sBendLeft",
                                width: 19,
                                height: 20,
                                image: customImageFor("sBendLeft"),
                            }),
                            element.toggle({
                                buttonType: "leftLargeTurn",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5142 // large half left turn
                            }),
                            element.toggle({
                                buttonType: "rightLargeTurn",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5143 // large half right turn
                            }),
                            element.toggle({
                                buttonType: "sBendRight",
                                width: 19,
                                height: 20,
                                image: customImageFor("sBendRight")
                            }),
                            element.toggle({
                                buttonType: "bankLeft",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5153 // left bank
                            }),
                            element.toggle({
                                buttonType: "noBank",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5154 // no bank
                            }),
                            element.toggle({
                                buttonType: "bankRight",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5155 // right bank
                            })
                        ]
                    }),
                    // // banking
                    // horizontal({
                    // 	height: buttonRowHeight,
                    // 	content: [
                    // 		element.toggle({
                    // 			buttonType: "bankLeft",
                    // 			width: directionButtonWidth,
                    // 			height: directionButtonHeight,
                    // 			image: 5153 // left bank
                    // 		}),
                    // 		element.toggle({
                    // 			buttonType: "noBank",
                    // 			width: directionButtonWidth,
                    // 			height: directionButtonHeight,
                    // 			image: 5154 // no bank
                    // 		}),
                    // 		element.toggle({
                    // 			buttonType: "bankRight",
                    // 			width: directionButtonWidth,
                    // 			height: directionButtonHeight,
                    // 			image: 5155 // right bank
                    // 		})
                    // 	]
                    // }),
                    // steepness
                    horizontal({
                        height: buttonRowHeight,
                        content: [
                            element.toggle({
                                buttonType: "down90",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5150 // down90
                            }),
                            element.toggle({
                                buttonType: "down60",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5144 // down60
                            }),
                            element.toggle({
                                buttonType: "down25",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5145 // down25
                            }),
                            element.toggle({
                                buttonType: "noPitch",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5146, // flat
                            }),
                            element.toggle({
                                buttonType: "up25",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5147 // Up25
                            }),
                            element.toggle({
                                buttonType: "up60",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5148 // up60
                            }),
                            element.toggle({
                                buttonType: "up90",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5149 // up90
                            }),
                        ]
                    }),
                    // keep the special dropdown for now
                    // button({
                    // 	padding: { top: 4 },
                    // 	text: "Special...",
                    // })
                ],
            }),
            groupbox({
                text: "Details",
                content: [
                    horizontal({
                        content: [
                            element.toggle({
                                buttonType: "chainLift",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5163 // chain
                            }),
                            element.toggle({
                                buttonType: "boosters",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5130 // boost
                            }),
                            element.toggle({
                                buttonType: "camera",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 23496 // camera
                            }),
                            element.toggle({
                                buttonType: "brakes",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5131 // brakes
                            }),
                            element.toggle({
                                buttonType: "blockBrakes",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5116 // block brakes
                            }),
                        ]
                    }),

                    // move to just one row for visibility
                    // horizontal({
                    // 	content: [
                    // 		element.toggle({
                    // 			buttonType: "brakes",
                    // 			width: directionButtonWidth,
                    // 			height: directionButtonHeight,
                    // 			image: 5131 // brakes
                    // 		}),
                    // 		element.toggle({
                    // 			buttonType: "blockBrakes",
                    // 			width: directionButtonWidth,
                    // 			height: directionButtonHeight,
                    // 			image: 5116 // block brakes
                    // 		}),
                    // 	]
                    // }),
                ]
            }),
            // demolish, move forward/back, select, trial run
            groupbox({
                content: [
                    horizontal({
                        content: [
                            element.toggle({
                                buttonType: "demolish",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5162 // demolish
                            }),
                            element.button({
                                buttonType: "iteratePrevious",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5160 // iterate to previous track
                            }),
                            // segment tile selector tool
                            element.toggle({
                                buttonType: "select",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                tooltip: "Use the picker to select a track segment by clicking it",
                                isPressed: compute(buttonState.pressedButtons.select, (isPicking) => isPicking),
                                image: 29402, // SPR_G2_EYEDROPPER
                            }),
                            element.button({
                                buttonType: "iterateNext",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 5161, // iterate to next track
                            }),
                            element.toggle({
                                buttonType: "simulate",
                                width: directionButtonWidth,
                                height: directionButtonHeight,
                                image: 29416 // start trial run
                            }),
                        ]
                    })

                ],
            }),
            // choose which segment from the selected tile
            dropdown({
                items: compute(model.trackElementsOnSelectedTile, (elements) => elements.map(e => `Ride: ${e.element.ride}, height: ${e.element.baseHeight}, i: ${TrackElementType[<TrackElementType>e.segment?.trackType || 0]}`)),
                onChange: (selectedIndex) => { segmentState.updateSegmentSequence(model.trackElementsOnSelectedTile.get()[selectedIndex].segment); },
                selectedIndex: compute(segmentState.selectedSegment, segment => {
                    const potentialIndexOf = model.trackElementsOnSelectedTile.get().map(tei => tei.segment).indexOf(segment);
                    return (potentialIndexOf === -1 ? 0 : potentialIndexOf);
                })
            }),
            // display stats for the selected segment
            listview({
                height: 100,
                items: compute(
                    buttonState.getButtonPressCombinationStores().curve,
                    buttonState.getButtonPressCombinationStores().curve,
                    buttonState.getButtonPressCombinationStores().curve, (curve, bank, pitch) => {

                        const initialBuildLocation = segmentState.getBuildLocation({ direction: buildDirection.get() });
                        const locationString = initialBuildLocation ? `${initialBuildLocation.x}, ${initialBuildLocation.y}, ${initialBuildLocation.z}; ${initialBuildLocation.direction}` : "No location";
                        return [
                            `Curve: ${curve ?? "none"}`,
                            `Bank: ${bank ?? "none"}`,
                            `Pitch: ${pitch ?? "none"}`,
                            `${locationString}`,
                        ];

                        // if (!segment) return ["No segment selected"];

                        // const segInfo = segment.get();
                        // return [
                        // 	`Ride: ${segInfo.ride}`,
                        // 	`Ride type: ${segInfo.rideType}`,
                        // 	`Track element type:  ${getTrackElementTypeName(segInfo.trackType)}`,
                        // 	`Location: ${segInfo.location.x}, ${segInfo.location.y}, ${segInfo.location.z}; ${segInfo.location.direction}`,
                        // 	``,
                        // 	`Next: ${segment.nextLocation()?.x}, ${segment.nextLocation()?.y}, ${segment.nextLocation()?.z}; ${segment.nextLocation()?.direction}`,
                        // 	`Previous: ${segment.previousLocation()?.x}, ${segment.previousLocation()?.y}, ${segment.previousLocation()?.z}; ${segment.previousLocation()?.direction}`,
                        // ];
                    })
            }),
            // // choose a new buildable segment
            // dropdown({
            // 	disabled: compute(model.buildableTrackTypes, trackTypes => { return trackTypes.length > 0 ? false : true; }),
            // 	items: compute(model.buildableTrackTypes, trackTypes => {
            // 		debug(`looking for track types: ${trackTypes}`);
            // 		const allSegments = trackTypes.map(trackType => TrackElementType[trackType]);
            // 		debug(`computing dropdown items: ${allSegments}`);
            // 		return allSegments;
            // 	}),
            // 	onChange: (index) => {
            // 		// todo make sure this functionality isn't exclusive because this doesn't fire upon initial segment selection
            // 		debug(`Segment selection dropdown changed to index ${index}`);

            // 		const newTrackType = model.buildableTrackTypes.get()[index];
            // 		debug(`New track type: ${newTrackType}`);
            // 		if (newTrackType !== null) {
            // 			model.selectedBuild.set(newTrackType);
            // 		}
            // 	},
            // 	selectedIndex: compute(model.selectedBuild, (selectedBuild) => {
            // 		debug(`computing selected index for dropdown`);
            // 		debug(`selectedBuild: ${selectedBuild}`);
            // 		const potentialIndexOf = model.buildableTrackTypes.get().indexOf(selectedBuild || 0);
            // 		debug(`potentialIndexOf: ${potentialIndexOf}`);
            // 		return (potentialIndexOf === -1 ? 0 : potentialIndexOf);
            // 	})

            // }),
            element.button({
                text: "Build",
                buttonType: "build"
            }),
            // ride favorite selection section

            // currently selected ride
            // horizontal({
            //     content: [
            //         dropdown({
            //             items: compute(buttonModel.favoriteRides, (favorites) => {
            //                 const selectedRideType = favorites[0]?.rideType;
            //                 if (!selectedRideType) return ["No ride selected"];
            //                 return [`${selectedRideType}-${RideType[selectedRideType || -1]}`];
            //             }),
            //             disabled: true
            //         }),
            //         button({
            //             width: 15,
            //             height: 15,
            //             isPressed: compute(buttonModel.selectedFavoriteIndex, (index) => {
            //                 return ((index == 0) ? true : false);
            //             }),
            //             onClick: () => {
            //                 buttonModel.selectedFavoriteIndex.set(0);
            //             }
            //         }),
            //     ]
            // }),
            // // first favorite
            // horizontal({
            //     content: [
            //         dropdown({
            //             items: compute(buttonModel.favoriteRides, (favorites) => {
            //                 return buttonModel.allAvailableTrackedRides.get().map(ride => `${ride}-${RideType[ride || -1]}`);
            //             }),
            //             disabled: compute(buttonModel.favoriteRides, (favorites) => {
            //                 // it should be disabled if nothing is selected
            //                 return (!favorites[0]?.rideType) ? true : false;
            //             }),
            //             onChange: (index) => {
            //                 const allTrackRides = buttonModel.allAvailableTrackedRides.get();
            //                 const newRideType = allTrackRides[index];
            //                 buttonModel.updateRideTypeFavorite(newRideType, 1);
            //             }
            //         }),
            //         button({
            //             width: 15,
            //             height: 15,
            //             isPressed: compute(buttonModel.selectedFavoriteIndex, (index) => {
            //                 return ((index == 1) ? true : false);
            //             }),
            //             onClick: () => {
            //                 buttonModel.selectedFavoriteIndex.set(1);
            //             }
            //         }),
            //     ]
            // }),

            // todo not sure if this is working, don't uncomment
            // second favorite
            // horizontal({
            // 	content: [
            // 		dropdown({
            // 			items: compute(buttonModel.f, (favorites) => {
            // 				return filterAvailableTrackTypeDropdowns(2);
            // 			}),
            // 			disabled: compute(buttonModel.rideTypeFavorites, (favorites) => {
            // 				// it should be disabled if nothing is selected
            // 				return (!favorites[0]?.ride) ? true : false;
            // 			}),
            // 			onChange: (index) => {
            // 				const allTrackRides = buttonModel.allAvailableTrackedRides.get();
            // 				// remove favorites[0].ride
            // 				const rideTypes = allTrackRides.filter(ride => ride !== buttonModel.rideTypeFavorites.get()[0]?.ride);
            // 				const newRideType = rideTypes[index];
            // 				// set the new ride type in buttonModel.rideTypeFavorites[1]
            // 				buttonModel.updateRideTypeFavorite(newRideType, 2)
            // 			}
            // 		}),
            // 		button({
            // 			width: 15,
            // 			height: 15,
            // 			isPressed: compute(buttonModel.selectedFavoriteIndex, (index) => {
            // 				return ((index == 1) ? true : false);
            // 			}),
            // 			onClick: () => {
            // 				buttonModel.selectedFavoriteIndex.set(1);
            // 			}
            // 		}),
            // 	]
            // }),
        ]
    });


};
