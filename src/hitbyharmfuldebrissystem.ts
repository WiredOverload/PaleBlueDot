import { Entity } from "./entity";

export function hitByHarmfulDebrisSystem(ents: Entity[]) {
    ents.forEach(ent => {
        if (ent.hitByHarmfulDebris && ent.vel) {
            if (ent.hitByHarmfulDebris.ticks >= 0) {
                ent.hitByHarmfulDebris.ticks--;
                ent.vel.rotational.z += ent.hitByHarmfulDebris.rotationAcc;
                ent.vel.positional.x += ent.hitByHarmfulDebris.xAcc;
                ent.vel.positional.y += ent.hitByHarmfulDebris.yAcc;
            }
        }
    });
}