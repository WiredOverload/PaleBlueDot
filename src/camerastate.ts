import * as THREE from "three";
import { State } from "./state";
import { Entity } from "./entity";
// import { BoardhouseUI } from "./boardhouseui";
import { 
    controlSystem, 
    positionSystem, 
    collisionSystem, 
    timerSystem, 
    animationSystem, 
    velocitySystem 
} from "./coresystems";
import { setSprite, setHurtBoxGraphic, setHitBoxGraphic } from "./helpers";
import { Vector3 } from "three";



/**
 * GameState that handles updating of all game-related systems.
 */
export class CameraState implements State {
    public entities: Entity[];
    public scene: THREE.Scene;
    // public rootWidget: BoardhouseUI.Widget;
    constructor(scene: THREE.Scene){
        this.entities = [];
        this.scene = scene;

        let background = new Entity();
        background.pos = {location: new Vector3(0, 0, 0), direction: new Vector3(0, 1, 0)};
        background.sprite = setSprite("../data/textures/cottage.png", scene, 2);
        //add componant to render multiple times / teleport to wrap
        this.entities.push(background);
        // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(camera: THREE.Camera, stateStack: State[]) {
        // pull in all system free functions and call each in the proper order
        controlSystem(this.entities, camera, stateStack);
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities, this.scene);
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
        positionSystem(this.entities);

        renderer.clear();
        renderer.render(this.scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}