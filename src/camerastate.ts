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
    velocitySystem, 
    cameraControlSystem
} from "./coresystems";
import { setSprite, setHurtBoxGraphic, setHitBoxGraphic } from "./helpers";
import { Vector3, Euler } from "three";
import { initializeControls } from "./corecomponents";



/**
 * GameState that handles updating of all game-related systems.
 */
export class CameraState implements State {
    public entities: Entity[];
    public scene: THREE.Scene;
    public camera: THREE.Camera;
    public player: Entity;
    // public rootWidget: BoardhouseUI.Widget;
    constructor(scene: THREE.Scene, player: Entity, earthSize: number){
        this.player = player;
        this.entities = [];
        this.scene = scene;

        let backgrounds: Entity[] = [];
        for(var i = 0; i < 9; i++){
            let background = new Entity();
            background.pos = {location: new Vector3(((i % 3) -1) * 4096, (Math.floor(i / 3) -1) * 2048, 0), direction: new Vector3(0, 1, 0)};
            background.sprite = setSprite("../data/textures/space4096Square.png", scene, 1);
            backgrounds.push(background);
            this.entities.push(background);
        }

        let crosshair = new Entity();
        crosshair.pos = { location: new Vector3((Math.random() * 8192) - 4096, (Math.random() * 8192) - 4096, 0), direction: new Vector3(0, 1, 0)};
        crosshair.sprite = setSprite("../data/textures/fancyCrosshair.png", scene, 4);
        crosshair.control = initializeControls(null);
        crosshair.vel = { positional: new Vector3(), rotational: new Euler() };
        this.entities.push(crosshair);

        let earth = new Entity();
        earth.pos = { location: new Vector3(0, 0, 0), direction: new Vector3(0, 1, 0)};
        //earth.pos = { location: new Vector3((Math.random() * 8192) - 4096, (Math.random() * 4096) - 2048, 0), direction: new Vector3(0, 1, 0)};
        earth.sprite = setSprite("../data/textures/earth.png", scene, earthSize);
        this.entities.push(earth);

        this.camera = new THREE.OrthographicCamera(1280 / - 2, 1280 / 2, 720 / 2, 720 / -2, -1000, 1000);
        scene.add(this.camera);
        //add componant to render multiple times / teleport to wrap
        
        // this.rootWidget = new BoardhouseUI.Widget();
    }

    public update(stateStack: State[]) {
        // pull in all system free functions and call each in the proper order
        
        velocitySystem(this.entities);
        collisionSystem(this.entities);
        animationSystem(this.entities);
        timerSystem(this.entities, this.scene);
        cameraControlSystem(this.entities, this.camera, stateStack);
    }

    public render(renderer: THREE.WebGLRenderer) {
        positionSystem(this.entities);

        renderer.clear();
        renderer.render(this.scene, this.camera);
        // check if children needs to be reconciled, then do so
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}