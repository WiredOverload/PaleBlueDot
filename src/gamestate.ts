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
        player.pos = { x: -100, y: -100, z: 5 , angle: 0};
        player.sprite = setSprite("../data/textures/spaceshipidle.png", scene, 4);
        player.control = initializeControls();
        player.vel = { xVelocity: 0, yVelocity: 0, rotationVelocity: 0 };
        player.anim = initializeAnimation(SequenceTypes.idle, spaceshipAnim);
        player.hurtBox = initializeHurtBox(player.sprite, HurtTypes.test);
        // setHurtBoxGraphic(player.sprite, player.hurtBox);

        let asteroid = new Entity();
        asteroid.pos = { x: 100, y: 100, z: 5, angle: 0 };
        asteroid.sprite = setSprite("../data/textures/asteroid1.png", scene, 4);
        asteroid.anim = initializeAnimation(SequenceTypes.idle, asteroidAnim);

        let redAsteroid = new Entity();
        redAsteroid.pos = { x: -250, y: 175, z: 4, angle: 0 };
        redAsteroid.sprite = setSprite("../data/textures/redAsteroid1.png", scene, 4);
        redAsteroid.anim = initializeAnimation(SequenceTypes.idle, redAsteroidAnim);

        let greenAsteroid = new Entity();
        greenAsteroid.pos = { x: -200, y: 125, z: 4, angle: 0 };
        greenAsteroid.sprite = setSprite("../data/textures/greenAsteroid1.png", scene, 4);
        greenAsteroid.anim = initializeAnimation(SequenceTypes.idle, greenAsteroidAnim);

        let blueAsteroid = new Entity();
        blueAsteroid.pos = { x: -150, y: 75, z: 4, angle: 0 };
        blueAsteroid.sprite = setSprite("../data/textures/blueAsteroid1.png", scene, 4);
        blueAsteroid.anim = initializeAnimation(SequenceTypes.idle, blueAsteroidAnim);

        let background = new Entity();
        background.pos = {x: 0, y: 0, z: 0, angle: 0};
        background.sprite = setSprite("../data/textures/space4096.png", scene, 2);
        //add componant to render multiple times / teleport to wrap
        this.entities.push(player);
        this.entities.push(asteroid);
        this.entities.push(blueAsteroid);
        this.entities.push(redAsteroid);
        this.entities.push(greenAsteroid);
        this.entities.push(background);

        // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(camera: THREE.Camera) {
        // pull in all system free functions and call each in the proper order
        controlSystem(this.entities, camera);
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities);
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene) {
        positionSystem(this.entities);

        renderer.render(scene, camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}