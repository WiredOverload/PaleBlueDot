import * as THREE from "three";
import { Entity } from "./entity";
// import { setHitBoxGraphic } from "./helpers";
import { HurtTypes } from "./corecomponents";
import { Resources } from "./resourcemanager";
import { changeSequence, destroyEntity, last } from "./helpers";
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
            if (ent.vel.friction) {
                ent.vel.positional.multiplyScalar(ent.vel.friction);
            }
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
                const newSpriteMap = Resources.instance.getTexture(ent.anim.blob[ent.anim.sequence][ent.anim.frame].texture.substr(1));
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
        if (ent.control && ent.pos) {
            camera.position.copy(ent.pos.location).add(new Vector3(-ent.pos.direction.y, ent.pos.direction.x, ent.pos.direction.z).multiplyScalar(360 - 64));
            camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), Math.atan2(ent.pos.direction.y, ent.pos.direction.x));

            if (ent.control.beacon) {
                ent.control.beacon = false;
                ent.control.deploy_beacon(ent);
            }

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
                if (ent.resources) {
                    ent.resources.fuel -= 1;
                }
                if (!ent.control.music) {
                    var audio = new Audio('./data/audio/Pale_Blue.mp3');
                    audio.loop = true;
                    audio.play();
                    ent.control.music = true;
                }
            }
            else if (ent.control.down) {
                ent.vel.positional.add(new Vector3(ent.pos.direction.y, -ent.pos.direction.x, -ent.pos.direction.z).multiplyScalar(posAccel));
                ent.anim = changeSequence(SequenceTypes.move, ent.anim);
                if (ent.resources) {
                    ent.resources.fuel -= 1;
                }
            }
            else {
                if(ent.anim) {
                    ent.anim = changeSequence(SequenceTypes.idle, ent.anim);
                }
            }

            if(ent.vel) {
                if (ent.vel.positional.length() > maxPosVel) {
                    ent.vel.positional.multiplyScalar(maxPosVel / ent.vel.positional.length())
                }

                if (Math.abs(ent.vel.rotational.z) > maxRotVel) {
                    ent.vel.rotational.z *= maxRotVel / Math.abs(ent.vel.rotational.z);
                }

                ent.vel.rotational.z *= 0.95;
            }

            if(ent.control.camera){
                var audio = new Audio('./data/audio/clickOpen.wav');
                audio.play();
                let cameraScene = new THREE.Scene();
                cameraScene.background = new THREE.Color("#000000");
                //cameraScene.add(camera);
                let cameraGameState = new CameraState(cameraScene, ent, Math.max(16 - (Math.abs(ent.pos.location.x / 1024) + Math.abs(ent.pos.location.y / 1024)), 0));
                stateStack.push(cameraGameState);
                ent.control.camera = false;
            }
        }
    });
}

export function cameraControlSystem(ents: Entity[], camera: THREE.Camera, stateStack: State[]) {
    const posAccel = 0.1;
    const rotAccel = 0.001;
    const maxPosVel = 10;
    const maxRotVel = 0.1;

    ents.forEach(ent => {
        
        if (ent.control && ent.pos) {
            camera.position.set(ent.pos.location.x, ent.pos.location.y, ent.pos.location.z);
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
            else if (ent.control.straferight) {
                ent.vel.positional.add(ent.pos.direction.clone().multiplyScalar(posAccel));
            }

            if (ent.control.up) {
                ent.vel.positional.add(new Vector3(-ent.pos.direction.y, ent.pos.direction.x, ent.pos.direction.z).multiplyScalar(posAccel));
            }
            else if (ent.control.down) {
                ent.vel.positional.add(new Vector3(ent.pos.direction.y, -ent.pos.direction.x, -ent.pos.direction.z).multiplyScalar(posAccel));
            }

            if(ent.pos.location.x > 1024) {
                ent.pos.location.x -= 2048;
            }
            else if(ent.pos.location.x < -1024) {
                ent.pos.location.x += 2048;
            }

            if(ent.pos.location.y > 1024) {
                ent.pos.location.y -= 2048;
            }
            else if(ent.pos.location.y < -1024) {
                ent.pos.location.y += 2048;
            }

            if(ent.control.camera){
                //turn logic
                //var xCloseness:number = (ent.pos.location.x % 512) / 512;
                //var yCloseness:number = (ent.pos.location.y % 1024) / 1024;
                //ent.pos.direction = new Vector3(- ent.pos.location.x, - ent.pos.location.y, 0).normalize();
                //ent.pos.direction.add(new Vector3(1000 * xCloseness, 1000 * yCloseness, 0).normalize());
                //last(stateStack).player.pos.direction = ent.pos.direction;

                stateStack.pop();
                ent.control.camera = false;
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

export function timerSystem(ents: Entity[], scene: THREE.Scene) {
    ents.forEach(ent => {
        if (ent.timer) {
            ent.timer.ticks--;

            if (ent.timer.ticks <= 0) {
                destroyEntity(ent, ents, scene);
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

export function deathCheckSystem(player: Entity, killPlayer: (reason: string) => void) {
    if (player.resources.fuel <= 0) {
        killPlayer('Out of fuel!');
    }
}