import { AnimationSchema, SequenceTypes } from "../../src/animationschema";

export const beaconAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 40,
            texture: "../data/textures/beacon.png",
            nextFrame: 1
       },
        {
            ticks: 40,
            texture: "../data/textures/beacoff.png",
            nextFrame: 0
       },
    ],
}