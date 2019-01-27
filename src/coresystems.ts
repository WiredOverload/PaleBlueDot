import * as THREE from "three";
import { Entity } from "./entity";
// import { setHitBoxGraphic } from "./helpers";
import { HurtTypes } from "./corecomponents";
import { Resources } from "./resourcemanager";
import { changeSequence } from "./helpers";
import { SequenceTypes } from "./animationschema";

/**
 * Rudimentary velocity implementation... will replace directions with
 * angle and magnitude later on
 */
export function velocitySystem(ents: Readonly<Entity>[]): void {
    ents.forEach(ent => {
        if (ent.vel !== undefined && ent.pos !== undefined) {
            ent.pos.x += ent.vel.xVelocity;
            ent.pos.y += ent.vel.yVelocity;
            ent.pos.angle += ent.vel.rotationVelocity;
        }
    });
}

export function animationSystem(ents: Readonly<Entity>[]): void {
    ents.forEach(ent => {
        if (ent.anim !== undefined && ent.sprite !== undefined) {
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
        if (hittingEnt.hitBox !== undefined && hittingEnt.pos !== undefined) {
            ents.forEach(hurtingEnt => {
                if (hurtingEnt.hurtBox !== undefined && hurtingEnt.pos !== undefined) {
                    if (hittingEnt.hitBox.collidesWith.indexOf(hurtingEnt.hurtBox.type) > -1) {

                        if (hittingEnt.pos.x + hittingEnt.hitBox.width / 2 < hurtingEnt.pos.x + hurtingEnt.hurtBox.width &&
                            hittingEnt.pos.x + hittingEnt.hitBox.width + hittingEnt.hitBox.width / 2 > hurtingEnt.pos.x &&
                            hittingEnt.pos.y + hittingEnt.hitBox.height / 2 < hurtingEnt.pos.y + hurtingEnt.hurtBox.height &&
                            hittingEnt.pos.y + hittingEnt.hitBox.height + hittingEnt.hitBox.height / 2 > hurtingEnt.pos.y) {
                            if (hittingEnt.hitBox.onHit !== undefined) {
                                hittingEnt.hitBox.onHit();
                            }

                            if (hurtingEnt.hurtBox.onHurt !== undefined) {
                                hurtingEnt.hurtBox.onHurt();
                            }
                        }
                    }
                }
            });
        }
    });
}

export function controlSystem(ents: Entity[], camera: THREE.Camera) {
    ents.forEach(ent => {
        if (ent.control !== undefined && ent.vel !== undefined && ent.pos !== undefined) {
            if (ent.control.left) {
                ent.vel.rotationVelocity += Math.PI/1000;
                camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), ent.pos.angle);
                // test change seq
                ent.anim = changeSequence(SequenceTypes.attack, ent.anim);
            }
            else if (ent.control.right) {
                //ent.vel.xVelocity += .05;
                ent.vel.rotationVelocity -= Math.PI/1000;
                camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), ent.pos.angle);
                // test change seq
                ent.anim = changeSequence(SequenceTypes.walk, ent.anim);
            }

            if (ent.control.up) {
                ent.vel.xVelocity += Math.cos(ent.pos.angle) * 1;
                ent.vel.yVelocity += Math.sin(ent.pos.angle) * 1;
                //camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/32);
                // test change seq
                ent.anim = changeSequence(SequenceTypes.walk, ent.anim);
            }
            else if (ent.control.down) {
                ent.vel.xVelocity -= Math.cos(ent.pos.angle) * 1;
                ent.vel.yVelocity -= Math.sin(ent.pos.angle) * 1;
                //ent.vel.rotationVelocity += 1;
                //camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/32);
                // test change seq
                ent.anim = changeSequence(SequenceTypes.walk, ent.anim);
            }
        }
    });
}

export function positionSystem(ents: Readonly<Entity>[]) {
    for (let i = 0; i < ents.length; i++) {
        ents.forEach(ent => {
            if (ent.sprite !== undefined && ent.pos !== undefined) {
                ent.sprite.position.set(ent.pos.x, ent.pos.y, ent.pos.z);
            }
        });
    }
}

export function timerSystem(ents: Entity[]) {
    ents.forEach(ent => {
        if (ent.timer !== undefined) {
            ent.timer.ticks--;

            if (ent.timer.ticks <= 0) {
                // remove ent for ent list
                ents.splice(ents.indexOf(ent), 1);

                // // destroy sprite if ent has one
                // if (ent.sprite !== undefined) {
                //     ent.sprite.destroy();
                // }

                // // destroy graphic if ent has one
                // if (ent.graphic !== undefined) {
                //     ent.graphic.destroy();
                // }
            }
        }
    });
}