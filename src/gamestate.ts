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
import { initializeControls, HurtTypes, initializeAnimation, initializeHurtBox, initializeHitBox } from "./corecomponents";
import { spaceshipAnim } from "../data/animations/spaceship";
import { asteroidAnim } from "../data/animations/asteroid";
import { redAsteroidAnim } from "../data/animations/redAsteroid";
import { greenAsteroidAnim } from "../data/animations/greenAsteroid";
import { blueAsteroidAnim } from "../data/animations/blueAsteroid";
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
        player.pos = { location: new Vector3(100, -100, 5), direction: new Vector3(0, 1, 0)};
        player.sprite = setSprite("../data/textures/spaceshipidle.png", scene, 4);
        player.control = initializeControls();
        player.vel = { positional: new Vector3(), rotational: new Euler() };
        player.anim = initializeAnimation(SequenceTypes.idle, spaceshipAnim);
        player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        // setHurtBoxGraphic(player.sprite, player.hurtBox);

        let asteroid = new Entity();
        asteroid.pos = { location: new Vector3(100, 100, 5), direction: new Vector3(0, 1, 0) };
        asteroid.sprite = setSprite("../data/textures/asteroid1.png", scene, 4);
        asteroid.anim = initializeAnimation(SequenceTypes.idle, asteroidAnim);

        let redAsteroid = new Entity();
        redAsteroid.pos = { location: new Vector3(-250, 175, 4), direction: new Vector3(0, 1, 0) };
        redAsteroid.sprite = setSprite("../data/textures/redAsteroid1.png", scene, 4);
        redAsteroid.anim = initializeAnimation(SequenceTypes.idle, redAsteroidAnim);

        let greenAsteroid = new Entity();
        greenAsteroid.pos = { location: new Vector3(-200, 125, 4), direction: new Vector3(0, 1, 0) };
        greenAsteroid.sprite = setSprite("../data/textures/greenAsteroid1.png", scene, 4);
        greenAsteroid.anim = initializeAnimation(SequenceTypes.idle, greenAsteroidAnim);

        let blueAsteroid = new Entity();
        blueAsteroid.pos = { location: new Vector3(-150, 75, 4), direction: new Vector3(0, 1, 0) };
        blueAsteroid.sprite = setSprite("../data/textures/blueAsteroid1.png", scene, 4);
        blueAsteroid.anim = initializeAnimation(SequenceTypes.idle, blueAsteroidAnim);

        let earth = new Entity();
        earth.pos = { location: new Vector3(0, 0, 1), direction: new Vector3(0, 1, 0) };
        earth.sprite = setSprite("../data/textures/earth.png", scene, 4);

        let background = new Entity();
        background.pos = { location: new Vector3(), direction: new Vector3(0, 1, 0) };
        background.sprite = setSprite("../data/textures/space4096.png", scene, 2);
        
        //add componant to render multiple times / teleport to wrap
        this.entities.push(player);
        this.entities.push(asteroid);
        this.entities.push(blueAsteroid);
        this.entities.push(redAsteroid);
        this.entities.push(greenAsteroid);
        this.entities.push(earth);
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