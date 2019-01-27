import { AnimationSchema, SequenceTypes} from "../../src/animationschema";

export const asteroidAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 20,
            texture: "../data/textures/asteroid1.png",
            nextFrame: 1
       },
        {
            ticks: 20,
            texture: "../data/textures/asteroid2.png",
            nextFrame: 2
       },
        {
            ticks: 20,
            texture: "../data/textures/asteroid3.png",
            nextFrame: 0
       },
    ],
}