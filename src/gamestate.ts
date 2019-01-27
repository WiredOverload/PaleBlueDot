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
import { Vector3, Euler, Camera, Mesh, Scene } from "three";
import { debrisSystem } from "./debrissystem";
import { beaconAnim } from "../data/animations/beacon";
import { hitByHarmfulDebrisSystem } from "./hitbyharmfuldebrissystem";


/**
 * GameState that handles updating of all game-related systems.
 */
export class GameState implements State {
    public entities: Entity[];
    public scene: THREE.Scene;
    public stateStack: State[];
    public player: Entity;

    public camera: Camera;
    private ui_scene: Scene;
    private ui_camera: Camera;
    private beacon_icons: Mesh[];
    
    private asteroidCollide = (hurtingEnt: Entity, hittingEnt: Entity) => {
        if (hurtingEnt.flags & Flag.HARMFULDEBRIS) {
            if (hittingEnt.resources) {
                hittingEnt.resources.fuel -= 100;
                destroyEntity(hurtingEnt, this.entities, this.scene);

                let xAcc = Math.floor(Math.random()*4) + 1;
                let yAcc = Math.floor(Math.random()*4) + 1;
                let rotAcc = Math.floor(Math.random()*4) + 1;
                xAcc *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                yAcc *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                rotAcc *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
                hittingEnt.hitByHarmfulDebris.rotationAcc = rotAcc * 0.001;
                hittingEnt.hitByHarmfulDebris.xAcc = xAcc * 0.1;
                hittingEnt.hitByHarmfulDebris.yAcc = yAcc * 0.1;
                hittingEnt.hitByHarmfulDebris.ticks = 50;
                console.log("harmful!!!");
            }
        }

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

    private deploy_beacon = (ent: Entity) => {
        if (ent.resources.beacons) {
            ent.resources.beacons -= 1;

            const beacon = new Entity();
            const dir = ent.vel.positional.clone().normalize();
            const x = dir.x;
            dir.x = -dir.y;
            dir.y = x;
            beacon.flags |= Flag.BEACON;
            beacon.pos = { location: ent.pos.location.clone(), direction: dir };
            beacon.vel = { positional: ent.vel.positional.clone(), rotational: new Euler(), friction: 0.95 };
            beacon.sprite = setSprite("../data/textures/beacon.png", this.scene, 2);
            beacon.anim = initializeAnimation(SequenceTypes.idle, beaconAnim);
    
            this.entities.push(beacon);
        }
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
        player.control = initializeControls(this.deploy_beacon);
        player.vel = { positional: new Vector3(), rotational: new Euler() };
        player.anim = initializeAnimation(SequenceTypes.idle, spaceshipAnim);
        // player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        player.resources = { blue: 0, green: 0, red: 0, fuel: 1800, beacons: 5 };
        player.hitBox = initializeHitBox(player.sprite, [HurtTypes.asteroid]);
        player.hitByHarmfulDebris = { ticks: 0, xAcc: 0, yAcc: 0, rotationAcc: 0 };
        // setHitBoxGraphic(player.sprite, player.hitBox);

        let earth = new Entity();
        earth.pos = { location: new Vector3(0, 0, 1), direction: new Vector3(0, 1, 0) };
        earth.sprite = setSprite("../data/textures/earth.png", scene, 4);

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
        this.entities.push(background);

        this.camera = new THREE.OrthographicCamera(1280 / - 2, 1280 / 2, 720 / 2, 720 / -2, -1000, 1000);
        scene.add(this.camera);
         // this.rootWidget = new BoardhouseUI.Widget();
        
        this.ui_scene = new Scene();
        this.ui_camera = new THREE.OrthographicCamera(0, 1280, 720, 0, -1000, 1000);

        const widget = setSprite("../data/textures/beacon.png", this.ui_scene, 1);
    }

    public update(stateStack: State[]) {
        // pull in all system free functions and call each in the proper order
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities, this.scene);
        debrisSystem(this.entities, this.scene, this.asteroidCollide, this.camera);
        hitByHarmfulDebrisSystem(this.entities);
        controlSystem(this.entities, this.camera, stateStack);
        tiledSpriteSystem(this.entities, this.camera);
        deathCheckSystem(this.player, this.onDeath);
    }

    public render(renderer: THREE.WebGLRenderer) {
        positionSystem(this.entities);

        renderer.autoClear = false;
        renderer.clear();
        renderer.render(this.scene, this.camera);
        renderer.render(this.ui_scene, this.ui_camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}