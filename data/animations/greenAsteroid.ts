import { AnimationSchema, SequenceTypes} from "../../src/animationschema";

export const greenAsteroidAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 20,
            texture: "../data/textures/greenAsteroid1.png",
            nextFrame: 1
       },
        {
            ticks: 20,
            texture: "../data/textures/greenAsteroid2.png",
            nextFrame: 2
       },
        {
            ticks: 20,
            texture: "../data/textures/greenAsteroid3.png",
            nextFrame: 0
       },
    ],
}