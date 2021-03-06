import { State } from "./state";
// import { BoardhouseUI } from "./boardhouseui";
import { GameState } from "./gamestate";
import { Entity } from "./entity";
// import { setSprite, clearStage } from "./helpers";

/**
 * Main Menu state that handles setting up all the start up processes.
 */
export class MainMenuState implements State {
    public entities: Entity[];
    public scene;
    public camera;
    public player;
    // public rootWidget: BoardhouseUI.Widget;
    constructor(stateStack: State[]) { //stage: PIXI.Container) {
        this.entities = [];

        // let startButton = BoardhouseUI.CreateWidget({
        //     color: 0x008080,
        //     height: 50,
        //     width: 155,
        //     lineWidth: 4,
        //     lineColor: 0xE0FFFF
        // });
        // startButton.left = 500;
        // startButton.top = 300;
        
        // let label = BoardhouseUI.CreateWidget();
        // label.setText("Start Game");

        // startButton.appendChild(label);
        // label.left = 10;
        // label.top = 10;

        // startButton.onClick = function() {
        //     // set up game state
        //     let gameState = new GameState(stage);

        //     // remove all containers from rootWidget before pushing new state
        //     clearStage(startButton.selfContainer);
            
        //     stateStack.push(gameState);
        // }

        // startButton.onHover = function() {
        //     startButton.style.color = 0x000000;
        //     label.setText("Start Button", new PIXI.TextStyle({fill: 0xFFFFFF}));
        // }

        // startButton.offHover = function() {
        //     startButton.style.color = 0x008080;
        //     label.setText("Start Button", new PIXI.TextStyle({fill: 0x000000}));
        // }

        // this.rootWidget = startButton;
    }
    public update() {//, stage: PIXI.Container) {
        // ...
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
        // BoardhouseUI.ReconcilePixiDom(this.rootWidget, stage);
    }
}