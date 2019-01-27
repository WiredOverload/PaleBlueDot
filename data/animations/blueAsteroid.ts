import { AnimationSchema, SequenceTypes} from "../../src/animationschema";

export const blueAsteroidAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 20,
            texture: "../data/textures/blueAsteroid1.png",
            nextFrame: 1
       },
        {
            ticks: 20,
            texture: "../data/textures/blueAsteroid2.png",
            nextFrame: 2
       },
        {
            ticks: 20,
            texture: "../data/textures/blueAsteroid3.png",
            nextFrame: 0
       },
    ],
}