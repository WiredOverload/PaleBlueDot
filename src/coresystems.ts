import * as THREE from "three";
import { Entity } from "./entity";
// import { setHitBoxGraphic } from "./helpers";
import { HurtTypes } from "./corecomponents";
import { Resources } from "./resourcemanager";
import { changeSequence } from "./helpers";
import { SequenceTypes } from "./animationschema";
import { State } from "./state";
import { GameState } from "./gamestate";
import { CameraState } from "./camerastate";
import { Quaternion, Vector3, Euler, Camera } from "three";

/**
 * Rudimentary velocity implementation... will replace directions with
 * angle and magnitude later on
 */
export function velocitySystem(ents: Readonly<Entity>[]) : void {
    ents.forEach(ent => { 
        if (ent.vel && ent.pos) {
            ent.pos.location.add(ent.vel.positional);
            ent.pos.direction.applyEuler(ent.vel.rotational);
        }
    });
}

export function animationSystem(ents: Readonly<Entity>[]): void {
    ents.forEach(ent => {
        if (ent.anim && ent.sprite) {
            ent.anim.ticks--;
            if (ent.anim.ticks <= 0) {
                ent.anim.frame = ent.anim.blob[ent.anim.sequence][ent.anim.frame].nextFrame;
                ent.anim.ticks = ent.anim.blob[ent.anim.sequence][ent.anim.frame].ticks;
                const newSpriteMap = Resources.instance.getTexture(ent.anim.blob[ent.anim.sequence][ent.anim.frame].texture);
                newSpriteMap.magFilter = THREE.NearestFilter;
                ent.sprite.material = new THREE.MeshBasicMaterial({ map: newSpriteMap, transparent: true });
            }
        }
    });
}

export function collisionSystem(ents: Readonly<Entity>[]) {
    ents.forEach(hittingEnt => {
        if (hittingEnt.hitBox && hittingEnt.pos) {
            ents.forEach(hurtingEnt => {
                if (hurtingEnt.hurtBox && hurtingEnt.pos) {
                    if (hittingEnt.hitBox.collidesWith.indexOf(hurtingEnt.hurtBox.type) > -1) {
                        if (hittingEnt.pos.location.x - hittingEnt.hitBox.width / 2 < hurtingEnt.pos.location.x + hurtingEnt.hurtBox.width/2 &&
                            hittingEnt.pos.location.x + hittingEnt.hitBox.width / 2 > hurtingEnt.pos.location.x - hurtingEnt.hurtBox.width/2 &&
                            hittingEnt.pos.location.y - hittingEnt.hitBox.height / 2 < hurtingEnt.pos.location.y + hurtingEnt.hurtBox.height/2 &&
                            hittingEnt.pos.location.y + hittingEnt.hitBox.height / 2 > hurtingEnt.pos.location.y - hurtingEnt.hurtBox.height/2) {
                            if (hittingEnt.hitBox.onHit) {
                                hittingEnt.hitBox.onHit(hittingEnt, hurtingEnt);
                            }

                            if (hurtingEnt.hurtBox.onHurt) {
                                hurtingEnt.hurtBox.onHurt(hurtingEnt, hittingEnt);
                            }
                        }
                    }
                }
            });
        }
    });
}

export function controlSystem(ents: Entity[], camera: THREE.Camera, stateStack: State[]) {
    const posAccel = 0.1;
    const rotAccel = 0.001;
    const maxPosVel = 10;
    const maxRotVel = 0.1;

    ents.forEach(ent => {
        if (ent.control && ent.vel && ent.pos) {
            camera.position.copy(ent.pos.location).add(new Vector3(-ent.pos.direction.y, ent.pos.direction.x, ent.pos.direction.z).multiplyScalar(360 - 64));
            camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), Math.atan2(ent.pos.direction.y, ent.pos.direction.x));

            if (ent.control.left) {
                ent.vel.rotational.z += rotAccel;
            }
            else if (ent.control.right) {
                ent.vel.rotational.z -= rotAccel;
            }

            if (ent.control.strafeleft) {
                ent.vel.positional.add(ent.pos.direction.clone().multiplyScalar(-posAccel));
            }
            
            if (ent.control.straferight) {
                ent.vel.positional.add(ent.pos.direction.clone().multiplyScalar(posAccel));
            }

            if (ent.control.up) {
                ent.vel.positional.add(new Vector3(-ent.pos.direction.y, ent.pos.direction.x, ent.pos.direction.z).multiplyScalar(posAccel));
                ent.anim = changeSequence(SequenceTypes.move, ent.anim);
            }
            else if (ent.control.down) {
                ent.vel.positional.add(new Vector3(ent.pos.direction.y, -ent.pos.direction.x, -ent.pos.direction.z).multiplyScalar(posAccel));
                ent.anim = changeSequence(SequenceTypes.move, ent.anim);
            }
            else {
                ent.anim = changeSequence(SequenceTypes.idle, ent.anim);
            }

            if (ent.vel.positional.length() > maxPosVel) {
                ent.vel.positional.multiplyScalar(maxPosVel / ent.vel.positional.length())
            }

            if (Math.abs(ent.vel.rotational.z) > maxRotVel) {
                ent.vel.rotational.z *= maxRotVel / Math.abs(ent.vel.rotational.z);
            }

            ent.vel.rotational.z *= 0.95;
            
            if(ent.control.camera){
                if(stateStack.length < 2) {
                    let cameraScene = new THREE.Scene();
                    cameraScene.background = new THREE.Color("#FFFFFF");
                    //const renderer = new THREE.WebGLRenderer();
                    //renderer.setSize(1280, 720);
                    //const rendererSize = renderer.getSize();
                    const camera = new THREE.OrthographicCamera(1280 / - 2, 1280 / 2, 720 / 2, 720 / -2, -1000, 1000);
                    cameraScene.add(camera);
                    let cameraGameState = new CameraState(cameraScene);
                    stateStack.push(cameraGameState);
                }
                else {
                    stateStack.pop();
                }
            }
        }
    });
}

export function positionSystem(ents: Readonly<Entity>[]) {
    for (let i = 0; i < ents.length; i++) {
        ents.forEach(ent => {
            if (ent.sprite && ent.pos) {
                ent.sprite.position.copy(ent.pos.location);
                ent.sprite.rotation.set(0, 0, Math.atan2(ent.pos.direction.y, ent.pos.direction.x));
            }
        });
    }
}

export function timerSystem(ents: Entity[]) {
    ents.forEach(ent => {
        if (ent.timer) {
            ent.timer.ticks--;

            if (ent.timer.ticks <= 0) {
                // remove ent for ent list
                ents.splice(ents.indexOf(ent), 1);

                // // destroy sprite if ent has one
                // if (ent.sprite) {
                //     ent.sprite.destroy();
                // }

                // // destroy graphic if ent has one
                // if (ent.graphic) {
                //     ent.graphic.destroy();
                // }
            }
        }
    });
}

export function tiledSpriteSystem(ents: Entity[], camera: Camera) {
    ents.forEach(ent => {
        if (ent.tiledSprite) {
            const tilePos = camera.position.clone();

            tilePos.x = Math.round(tilePos.x / ent.tiledSprite.width);
            tilePos.y = Math.round(tilePos.y / ent.tiledSprite.height);

            const hOff = camera.position.x < tilePos.x * ent.tiledSprite.width ? -1 : 1;
            const vOff = camera.position.y < tilePos.y * ent.tiledSprite.height ? -1 : 1;

            ent.tiledSprite.sprites[0].position.set(tilePos.x * ent.tiledSprite.width, tilePos.y * ent.tiledSprite.height, 0);
            ent.tiledSprite.sprites[1].position.set((tilePos.x + hOff) * ent.tiledSprite.width, tilePos.y * ent.tiledSprite.height, 0);
            ent.tiledSprite.sprites[2].position.set(tilePos.x * ent.tiledSprite.width, (tilePos.y + vOff) * ent.tiledSprite.height, 0);
            ent.tiledSprite.sprites[3].position.set((tilePos.x + hOff) * ent.tiledSprite.width, (tilePos.y + vOff) * ent.tiledSprite.height, 0);
        }
    });
}