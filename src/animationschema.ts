// export type AnimationSchema<T extends SequenceTypes> = {
//     /**
//      * Key into an animation sequence using the
//      * SequenceTypes enum.
//      */
//     [P in keyof T]: Array<{
//         /**
//          * Number of ticks until the next frame is displayed.
//          */
//         ticks: number,
//         /**
//          * Url path to the file of the frame's texture.
//          */
//         texture: string,
//         /**
//          * Index of frame that will display once ticks == 0.
//          */
//         nextFrame: number
//     }>;
// }

export interface AnimationSchema {
    /**
     * Key into an animation sequence using the
     * index of the SequenceTypes enum.
     */
    [index: number]: Array<{
        /**
         * Number of ticks until the next frame is displayed.
         */
        ticks: number,
        /**
         * Url path to the file of the frame's texture.
         */
        texture: string,
        /**
         * Index of frame that will display once ticks == 0.
         */
        nextFrame: number
    }>;
}

export enum SequenceTypes {
    idle,
    move,
    attack
}