import { Entity, Flag } from "./entity";
import { setSprite, setHurtBoxGraphic, destroyEntity } from "./helpers";
import { initializeAnimation, initializeHurtBox, HurtTypes } from "./corecomponents";
import { SequenceTypes } from "./animationschema";
import { redAsteroidAnim } from "../data/animations/redAsteroid";
import * as THREE from 'three';
import { asteroidAnim } from "../data/animations/asteroid";
import { greenAsteroidAnim } from "../data/animations/greenAsteroid";
import { blueAsteroidAnim } from "../data/animations/blueAsteroid";

export function debrisSystem(ents: Entity[], scene: THREE.Scene, asteroidCollide: (hurtingEnt: Entity, hittingEnt: Entity) => void) {
    const randomNum = Math.floor(Math.random() * (750 - 0 + 1)) + 0;

    if (randomNum === 5) {
        let asteroid = new Entity();
        asteroid.pos = { location: new THREE.Vector3(100, 100, 5), direction: new THREE.Vector3(0, 1, 0) };
        asteroid.sprite = setSprite("../data/textures/asteroid1.png", scene, 4);
        asteroid.anim = initializeAnimation(SequenceTypes.idle, asteroidAnim);
        ents.push(asteroid);
    }

    if (randomNum === 112) {
        let redAsteroid = new Entity();
        redAsteroid.pos = { location: new THREE.Vector3(-250, 175, 4), direction: new THREE.Vector3(0, 1, 0) };
        redAsteroid.flags |= Flag.REDDEBRIS;
        redAsteroid.sprite = setSprite("../data/textures/redAsteroid1.png", scene, 4);
        redAsteroid.anim = initializeAnimation(SequenceTypes.idle, redAsteroidAnim);
        redAsteroid.hurtBox = initializeHurtBox(redAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        redAsteroid.hurtBox.onHurt = asteroidCollide;
        setHurtBoxGraphic(redAsteroid.sprite, redAsteroid.hurtBox);
        ents.push(redAsteroid);
    }

    if (randomNum === 368) {
        let greenAsteroid = new Entity();
        greenAsteroid.pos = { location: new THREE.Vector3(-200, 125, 4), direction: new THREE.Vector3(0, 1, 0) };
        greenAsteroid.flags |= Flag.GREENDEBRIS;
        greenAsteroid.sprite = setSprite("../data/textures/greenAsteroid1.png", scene, 4);
        greenAsteroid.anim = initializeAnimation(SequenceTypes.idle, greenAsteroidAnim);
        greenAsteroid.hurtBox = initializeHurtBox(greenAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        greenAsteroid.hurtBox.onHurt = asteroidCollide;
        setHurtBoxGraphic(greenAsteroid.sprite, greenAsteroid.hurtBox);
        ents.push(greenAsteroid);
    }

    if (randomNum === 412) {
        let blueAsteroid = new Entity();
        blueAsteroid.pos = { location: new THREE.Vector3(-150, 75, 4), direction: new THREE.Vector3(0, 1, 0) };
        blueAsteroid.flags |= Flag.BLUEDEBRIS;
        blueAsteroid.sprite = setSprite("../data/textures/blueAsteroid1.png", scene, 4);
        blueAsteroid.anim = initializeAnimation(SequenceTypes.idle, blueAsteroidAnim);
        blueAsteroid.hurtBox = initializeHurtBox(blueAsteroid.sprite, HurtTypes.asteroid, 0, 0, 75, 75);
        blueAsteroid.hurtBox.onHurt = asteroidCollide;
        setHurtBoxGraphic(blueAsteroid.sprite, blueAsteroid.hurtBox);
        ents.push(blueAsteroid);
    }
}