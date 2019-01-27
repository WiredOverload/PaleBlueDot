import { Entity, Flag } from "./entity";

export function resourceDrainSystem(ents: Entity[], scene: THREE.Scene) {
    ents.forEach(ent => {
        if (ent.flags & (Flag.BLUEDEBRIS | Flag.GREENDEBRIS | Flag.REDDEBRIS | Flag.HARMFULDEBRIS)) {
            
        }
    });
}