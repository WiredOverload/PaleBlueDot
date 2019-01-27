import { Entity, Flag } from "./entity";
import { setSprite, setHurtBoxGraphic, destroyEntity } from "./helpers";
import { initializeAnimation, initializeHurtBox, HurtTypes } from "./corecomponents";
import { SequenceTypes } from "./animationschema";
import { redAsteroidAnim } from "../data/animations/redAsteroid";
import * as THREE from 'three';
import { asteroidAnim } from "../data/animations/asteroid";
import { greenAsteroidAnim } from "../data/animations/greenAsteroid";
import { blueAsteroidAnim } from "../data/animations/blueAsteroid";

interface spawnPoints {
    xPos: number;
    yPos: number;
}

export function debrisSystem(ents: Entity[], scene: THREE.Scene, asteroidCollide: (hurtingEnt: Entity, hittingEnt: Entity) => void, camera: THREE.Camera) {
    const randomNum = Math.floor(Math.random() * (750 - 0 + 1)) + 0;
    let spawnPoints: spawnPoints[] = [];

    while (spawnPoints.length < 5) {
        let xPos = Math.floor(Math.random()*2560) + 1280;
        let yPos = Math.floor(Math.random()*1440) + 720;
        xPos *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        xPos *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        spawnPoints.push({ xPos: xPos, yPos: yPos });
    }
    const cameraXPos = 0; // set from camera
    const cameraYPos = 0; // set from camera;

    if (randomNum === 5 || randomNum === 632 || randomNum === 633) {
        let asteroid = new Entity();
        let velX = Math.floor(Math.random()*4) + 1;
        let velY = Math.floor(Math.random()*4) + 1;
        velX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        velY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        asteroid.pos = { location: new THREE.Vector3(spawnPoints[0].xPos + camera.position.x, spawnPoints[0].yPos + camera.position.y, 5), direction: new THREE.Vector3(0, 1, 0) };
        asteroid.flags |= Flag.HARMFULDEBRIS;
        asteroid.sprite = setSprite("../data/textures/asteroid1.png", scene, 4);
        asteroid.anim = initializeAnimation(SequenceTypes.idle, asteroidAnim);
        asteroid.hurtBox = initializeHurtBox(asteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        asteroid.hurtBox.onHurt = asteroidCollide;
        asteroid.vel = {positional: new THREE.Vector3(velX, velY, 0), rotational: new THREE.Euler() }
        // asteroid.timer = {ticks: 60 * 20};

        ents.push(asteroid);
    }

    if (randomNum === 112 || randomNum === 224 || randomNum === 225) {
        let redAsteroid = new Entity();
        let velX = Math.floor(Math.random()*4) + 1;
        let velY = Math.floor(Math.random()*4) + 1;
        velX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        velY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        redAsteroid.pos = { location: new THREE.Vector3(spawnPoints[1].xPos + camera.position.x, spawnPoints[1].yPos + camera.position.y, 4), direction: new THREE.Vector3(0, 1, 0) };
        redAsteroid.flags |= Flag.REDDEBRIS;
        redAsteroid.sprite = setSprite("../data/textures/redAsteroid1.png", scene, 4);
        redAsteroid.anim = initializeAnimation(SequenceTypes.idle, redAsteroidAnim);
        redAsteroid.hurtBox = initializeHurtBox(redAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        redAsteroid.hurtBox.onHurt = asteroidCollide;
        // setHurtBoxGraphic(redAsteroid.sprite, redAsteroid.hurtBox);
        redAsteroid.vel = {positional: new THREE.Vector3(velX, velY, 0), rotational: new THREE.Euler() }
        // redAsteroid.timer = {ticks: 60 * 20};

        ents.push(redAsteroid);
    }

    if (randomNum === 368 || randomNum === 414 || randomNum === 415) {
        let greenAsteroid = new Entity();
        let velX = Math.floor(Math.random()*4) + 1;
        let velY = Math.floor(Math.random()*4) + 1;
        velX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        velY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        greenAsteroid.pos = { location: new THREE.Vector3(spawnPoints[2].xPos + camera.position.x, spawnPoints[2].yPos + camera.position.y, 4), direction: new THREE.Vector3(0, 1, 0) };
        greenAsteroid.flags |= Flag.GREENDEBRIS;
        greenAsteroid.sprite = setSprite("../data/textures/greenAsteroid1.png", scene, 4);
        greenAsteroid.anim = initializeAnimation(SequenceTypes.idle, greenAsteroidAnim);
        greenAsteroid.hurtBox = initializeHurtBox(greenAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        greenAsteroid.hurtBox.onHurt = asteroidCollide;
        // setHurtBoxGraphic(greenAsteroid.sprite, greenAsteroid.hurtBox);
        greenAsteroid.vel = {positional: new THREE.Vector3(velX, velY, 0), rotational: new THREE.Euler() }
        // greenAsteroid.timer = {ticks: 60 * 20};

        ents.push(greenAsteroid);
    }

    if (randomNum === 412 || randomNum === 700 || randomNum === 713) {
        let velX = Math.floor(Math.random()*4) + 1;
        let velY = Math.floor(Math.random()*4) + 1;
        velX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        velY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        let blueAsteroid = new Entity();
        blueAsteroid.pos = { location: new THREE.Vector3(spawnPoints[3].xPos + camera.position.x, spawnPoints[3].yPos + camera.position.y, 4), direction: new THREE.Vector3(0, 1, 0) };
        blueAsteroid.flags |= Flag.BLUEDEBRIS;
        blueAsteroid.sprite = setSprite("../data/textures/blueAsteroid1.png", scene, 4);
        blueAsteroid.anim = initializeAnimation(SequenceTypes.idle, blueAsteroidAnim);
        blueAsteroid.hurtBox = initializeHurtBox(blueAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        blueAsteroid.hurtBox.onHurt = asteroidCollide;
        // setHurtBoxGraphic(blueAsteroid.sprite, blueAsteroid.hurtBox);
        blueAsteroid.vel = {positional: new THREE.Vector3(velX, velY, 0), rotational: new THREE.Euler() }
        // blueAsteroid.timer = {ticks: 60 * 20};

        ents.push(blueAsteroid);
    }
}