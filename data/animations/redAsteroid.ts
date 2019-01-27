import { AnimationSchema, SequenceTypes} from "../../src/animationschema";

export const redAsteroidAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 20,
            texture: "../data/textures/redAsteroid1.png",
            nextFrame: 1
       },
        {
            ticks: 20,
            texture: "../data/textures/redAsteroid2.png",
            nextFrame: 2
       },
        {
            ticks: 20,
            texture: "../data/textures/redAsteroid3.png",
            nextFrame: 0
       },
    ],
}