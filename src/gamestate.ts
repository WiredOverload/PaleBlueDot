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
    velocitySystem, 
    tiledSpriteSystem,
    deathCheckSystem
} from "./coresystems";
import { setSprite, setHitBoxGraphic, destroyEntity } from "./helpers";
import { initializeControls, HurtTypes, initializeAnimation, initializeHitBox } from "./corecomponents";
import { spaceshipAnim } from "../data/animations/spaceship";
import { SequenceTypes } from "./animationschema";
import { Vector3, Euler } from "three";
import { debrisSystem } from "./debrissystem";
import { beaconAnim } from "../data/animations/beacon";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState implements State {
    public entities: Entity[];
    public scene: THREE.Scene;
    public stateStack: State[];
    public player: Entity;
    
    private asteroidCollide = (hurtingEnt: Entity, hittingEnt: Entity) => {
        if (hurtingEnt.flags & Flag.BLUEDEBRIS) {
            if (hittingEnt.resources) {
                if (Math.abs((Math.abs(hurtingEnt.vel.positional.x) - Math.abs(hittingEnt.vel.positional.x))) <= .25 &&
                    Math.abs((Math.abs(hurtingEnt.vel.positional.y) - Math.abs(hittingEnt.vel.positional.y))) <= .25) {
                    hittingEnt.resources.blue++;
                    destroyEntity(hurtingEnt, this.entities, this.scene);
                    console.log("blue: " + hittingEnt.resources.blue);
                }
            }
        }

        if (hurtingEnt.flags & Flag.REDDEBRIS) {
            if (hittingEnt.resources) {
                if (Math.abs((Math.abs(hurtingEnt.vel.positional.x) - Math.abs(hittingEnt.vel.positional.x))) <= .25 &&
                    Math.abs((Math.abs(hurtingEnt.vel.positional.y) - Math.abs(hittingEnt.vel.positional.y))) <= .25) {
                    hittingEnt.resources.red++;
                    destroyEntity(hurtingEnt, this.entities, this.scene);
                    console.log("red: " + hittingEnt.resources.red);
                }
            }
        }

        if (hurtingEnt.flags & Flag.GREENDEBRIS) {
            if (hittingEnt.resources) {
                if (Math.abs((Math.abs(hurtingEnt.vel.positional.x) - Math.abs(hittingEnt.vel.positional.x))) <= .25 &&
                    Math.abs((Math.abs(hurtingEnt.vel.positional.y) - Math.abs(hittingEnt.vel.positional.y))) <= .25) {
                    hittingEnt.resources.green++;
                    destroyEntity(hurtingEnt, this.entities, this.scene);
                    console.log("green: " + hittingEnt.resources.green);
                }
            }
        }
    }

    private onDeath = (reason: string) => {
        alert('You died! ' + reason);
        this.stateStack.pop();
    }

    // public rootWidget: BoardhouseUI.Widget;
    constructor(scene: THREE.Scene, stateStack: State[]){
        this.entities = [];
        this.scene = scene;
        this.stateStack = stateStack;
        // set up entities
        let player = new Entity();
        this.player = player;
        player.pos = { location: new Vector3(100, -100, 5), direction: new Vector3(0, 1, 0)};
        player.sprite = setSprite("../data/textures/spaceshipidle.png", scene, 4);
        player.control = initializeControls();
        player.vel = { positional: new Vector3(), rotational: new Euler() };
        player.anim = initializeAnimation(SequenceTypes.idle, spaceshipAnim);
        // player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        player.resources = { blue: 0, green: 0, red: 0, fuel: 1800 };
        player.hitBox = initializeHitBox(player.sprite, [HurtTypes.asteroid]);
        // setHitBoxGraphic(player.sprite, player.hitBox);

        let earth = new Entity();
        earth.pos = { location: new Vector3(0, 0, 1), direction: new Vector3(0, 1, 0) };
        earth.sprite = setSprite("../data/textures/earth.png", scene, 4);

        let beacon = new Entity();
        beacon.pos = { location: new Vector3(200, 100, 3), direction: new Vector3(0, 1, 0) };
        beacon.sprite = setSprite("../data/textures/beacon.png", scene, 2);
        beacon.anim = initializeAnimation(SequenceTypes.idle, beaconAnim);

        let background = new Entity();
        background.pos = { location: new Vector3(), direction: new Vector3(0, 1, 0) };
        background.tiledSprite = {
            sprites: [
                setSprite("../data/textures/space4096.png", scene, 2),
                setSprite("../data/textures/space4096.png", scene, 2),
                setSprite("../data/textures/space4096.png", scene, 2),
                setSprite("../data/textures/space4096.png", scene, 2),
            ],
            width: 4096 * 2,
            height: 4096,
        };
        
        //add component to render multiple times / teleport to wrap
        this.entities.push(player);
        this.entities.push(earth);
        this.entities.push(beacon);
        this.entities.push(background);
         // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(camera: THREE.Camera, stateStack: State[]) {
        // pull in all system free functions and call each in the proper order
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities, this.scene);
        debrisSystem(this.entities, this.scene, this.asteroidCollide, camera);
        controlSystem(this.entities, camera, stateStack);
        tiledSpriteSystem(this.entities, camera);
        deathCheckSystem(this.player, this.onDeath);
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
        positionSystem(this.entities);

        renderer.clear();
        renderer.render(this.scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}