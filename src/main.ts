import * as THREE from "three";
import { State } from "./state";
import { last, setSprite } from "./helpers";
import { setEventListeners } from "./seteventlisteners";
// import { BoardhouseUI } from "./boardhouseui";
import { GameState } from "./gamestate";
import { Resources, loadTextures } from "./resourcemanager";

// TODO: Get hit collision system back online (in progress)
// -> test new hit/hurt box offsetters
// TODO: Rework UI layer (in progress) 
// -> USE OPTIONAL PROPS FOR PROP INTERFACE
// TODO: Rework velocity system (not started)
// TODO: Add acceleration system (not started)
// TODO: Add scene transitions (not started)
// ----- (start sbo prototype at this point)
// TODO: Implement screen shake (not started)
// TODO: Add particle effect renderer (not started)
// TODO: Make generic key binder (not started)
// TODO: Add unit tests (not started)
// TODO: Create level editor (not started)

loadTextures([
    "./data/textures/cottage.png",
    "./data/textures/girl.png",
    "./data/textures/msknight.png",
    "./data/textures/snow.png",
    "./data/textures/space4096.png",
    "./data/textures/asteroid1.png",
    "./data/textures/asteroid2.png",
    "./data/textures/asteroid3.png",
    "./data/textures/blueAsteroid1.png",
    "./data/textures/blueAsteroid2.png",
    "./data/textures/blueAsteroid3.png",
    "./data/textures/greenAsteroid1.png",
    "./data/textures/greenAsteroid2.png",
    "./data/textures/greenAsteroid3.png",
    "./data/textures/redAsteroid1.png",
    "./data/textures/redAsteroid2.png",
    "./data/textures/redAsteroid3.png",
    "./data/textures/spaceshipidle.png",
    "./data/textures/spaceshipmove.png",
    "./data/textures/earth.png",
    "./data/textures/fancyCrosshair.png",
    "./data/textures/beacon.png",
    "./data/textures/beacoff.png",
    "./data/textures/space4096Square.png",
    "./data/textures/red.png",
    "./data/textures/green.png",
    "./data/textures/blue.png",
    "./data/textures/yellow.png",
]).then((textures) => {
    // cache off textures
    Resources.instance.textures = textures;

    // start game
    main(<HTMLElement>document.getElementById("canvasContainer"));
});

/**
 * 
 * @param canvasContainer Captured Canvas Container Element
 * 
 * Main function that gets immediately invoked.
 * Only dependecy is the canvas container element. Also triggers the event pump.
 */
function main(canvasContainer: HTMLElement) {
    // set up renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1280, 720);
    const rendererSize = renderer.getSize();

    // set up scene
    let scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    // set up camera 
    // var camera = new THREE.PerspectiveCamera(75, 1280 / 720, 0.1, 1000);
    const camera = new THREE.OrthographicCamera(rendererSize.width / - 2, rendererSize.width / 2, rendererSize.height / 2, rendererSize.height / -2, -1000, 1000);
    scene.add(camera);

    canvasContainer.append(renderer.domElement);

    // initialize state stack
    let stateStack: State[] = [];
    let gameState = new GameState(scene, stateStack);
    stateStack.push(gameState);

    let fps: number = 0;
    let totalTime: number = 0;
    let currentTime: number = 0;
    // let fpsWidget = BoardhouseUI.CreateWidget();
    // fpsWidget.setText("FPS:");


    // set up event listeners
    setEventListeners(renderer.domElement, stateStack);

    // logic update loop
    setInterval(function (): void {
        if (stateStack.length > 0) {
            // call update on last element in state stack
            last(stateStack).update(stateStack);
        }
        else {
            throw "No states to update";
        }

        // log FPS
        // fpsWidget.setText("FPS: " + Math.round(fps));
        // BoardhouseUI.ReconcilePixiDom(fpsWidget, app.stage);
    }, 1000/60);

    // render update loop
    function renderLoop(timeStamp: number) {
        requestAnimationFrame(renderLoop);
        currentTime = timeStamp - totalTime;
        totalTime = timeStamp;
        fps = 1 / (currentTime / 1000);
                
        if (stateStack.length > 0) {
            // call render on last element in state stack
            last(stateStack).render(renderer, last(stateStack).camera);
        }
        else {
            throw "No states to render";
        }
    }

    // start the render loop
    renderLoop(0);
}