import * as THREE from "three";
import { State } from "./state";
import { Entity, Flag } from "./entity";
// import { BoardhouseUI } from "./boardhouseui";
import { 
    controlSystem, 
    positionSystem, 
    collisionSystem, 
    timerSystem, 
    animationSystem, 
    velocitySystem 
} from "./coresystems";
import { setSprite, setHurtBoxGraphic, setHitBoxGraphic, destroyEntity } from "./helpers";
import { initializeControls, HurtTypes, initializeAnimation, initializeHurtBox, initializeHitBox } from "./corecomponents";
import { spaceshipAnim } from "../data/animations/spaceship";
import { SequenceTypes } from "./animationschema";
import { Vector3, Quaternion, Euler } from "three";
import { debrisSystem } from "./debrissystem";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState implements State {
    public entities: Entity[];
    public scene: THREE.Scene;
    public asteroidCollide = (hurtingEnt: Entity, hittingEnt: Entity) => {
        if (hurtingEnt.flags & Flag.BLUEDEBRIS) {
            if (hittingEnt.resources) {
                hittingEnt.resources.blue++;
                destroyEntity(hurtingEnt, this.entities, this.scene);
                console.log("blue: " + hittingEnt.resources.blue);
            }
        }

        if (hurtingEnt.flags & Flag.REDDEBRIS) {
            if (hittingEnt.resources) {
                hittingEnt.resources.red++;
                destroyEntity(hurtingEnt, this.entities, this.scene);
                console.log("red: " + hittingEnt.resources.red);
            }
        }

        if (hurtingEnt.flags & Flag.GREENDEBRIS) {
            if (hittingEnt.resources) {
                hittingEnt.resources.green++;
                destroyEntity(hurtingEnt, this.entities, this.scene);
                console.log("green: " + hittingEnt.resources.green);
            }
        }
    }
    // public rootWidget: BoardhouseUI.Widget;
    constructor(scene: THREE.Scene){
        this.entities = [];
        this.scene = scene;
        // set up entities
        let player = new Entity();
        player.pos = { location: new Vector3(100, -100, 5), direction: new Vector3(0, 1, 0)};
        player.sprite = setSprite("../data/textures/spaceshipidle.png", scene, 4);
        player.control = initializeControls();
        player.vel = { positional: new Vector3(), rotational: new Euler() };
        player.anim = initializeAnimation(SequenceTypes.idle, spaceshipAnim);
        // player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        player.resources = { blue: 0, green: 0, red: 0 };
        player.hitBox = initializeHitBox(player.sprite, [HurtTypes.asteroid]);
        setHitBoxGraphic(player.sprite, player.hitBox);

        let earth = new Entity();
        earth.pos = { location: new Vector3(0, 0, 1), direction: new Vector3(0, 1, 0) };
        earth.sprite = setSprite("../data/textures/earth.png", scene, 4);

        let background = new Entity();
        background.pos = { location: new Vector3(), direction: new Vector3(0, 1, 0) };
        background.sprite = setSprite("../data/textures/space4096.png", scene, 2);
        
        //add component to render multiple times / teleport to wrap
        this.entities.push(player);
        this.entities.push(earth);
        this.entities.push(background);
         // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(camera: THREE.Camera, stateStack: State[]) {
        // pull in all system free functions and call each in the proper order
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities);
        debrisSystem(this.entities, this.scene, this.asteroidCollide);
        controlSystem(this.entities, camera, stateStack);
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
        positionSystem(this.entities);

        renderer.clear();
        renderer.render(this.scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}