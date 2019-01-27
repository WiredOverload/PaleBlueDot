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
import { setSprite, setHurtBoxGraphic } from "./helpers";
import { initializeControls, HurtTypes, initializeAnimation, initializeHurtBox } from "./corecomponents";
import { playerAnim } from "../data/animations/player";
import { SequenceTypes } from "./animationschema";
import { Vector3, Quaternion, Euler } from "three";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState implements State {
    public entities: Entity[];
    // public rootWidget: BoardhouseUI.Widget;
    constructor(scene: THREE.Scene){
        this.entities = [];
        // set up entities
        let player = new Entity();
        player.pos = { location: new Vector3(-100, -100, 5), direction: new Vector3(0, 1, 0)};
        player.sprite = setSprite("../data/textures/msknight.png", scene, 4);
        player.control = initializeControls();
        player.vel = { positional: new Vector3(), rotational: new Euler() };
        player.anim = initializeAnimation(SequenceTypes.walk, playerAnim);
        player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        setHurtBoxGraphic(player.sprite, player.hurtBox);
        
        this.entities.push(player);

        let background = new Entity();
        background.pos = { location: new Vector3(), direction: new Vector3(0, 1, 0) };
        background.sprite = setSprite("../data/textures/space4096.png", scene, 2);
        //add componant to render multiple times / teleport to wrap
        this.entities.push(background);

        // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(camera: THREE.Camera) {
        // pull in all system free functions and call each in the proper order
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities);
        controlSystem(this.entities, camera);
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene) {
        positionSystem(this.entities);

        renderer.render(scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}