// import { BoardhouseUI } from "./boardhouseui";
import { Entity } from "./entity";

/**
 * Interface all states need to implement as the event pump will use a stack
 * of these to determine which state the player is in.
 */
export interface State {
    /**
     * Needs reference to state stack to have the ability to pop own
     * state off the stack. And ref to app to render entities / UI
     * elements to the canvas.
     */
    entities: Entity[];

    scene: THREE.Scene;

    camera: THREE.Camera;

    player: Entity;

    update(stateStack: State[]);
    
    render(renderer: THREE.WebGLRenderer, camera: THREE.Camera);

    // rootWidget: BoardhouseUI.Widget;
}