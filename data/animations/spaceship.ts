import { AnimationSchema, SequenceTypes} from "../../src/animationschema";

export const spaceshipAnim: AnimationSchema = {
    [SequenceTypes.idle]: [
        {
            ticks: 0,
            texture: "../data/textures/spaceshipidle.png",
            nextFrame: 0
       },
    ],
    [SequenceTypes.move]: [
        {
            ticks: 0,
            texture: "../data/textures/spaceshipmove.png",
            nextFrame: 0
       },
    ],
}