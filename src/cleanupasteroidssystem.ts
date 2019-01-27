import { Entity, Flag } from "./entity";
import { destroyEntity } from "./helpers";

export function cleanUpAsteroidsSystem(ents: Entity[], camera: THREE.Camera, scene: THREE.Scene) {
    ents.forEach(ent => {
        if (ent.flags & (Flag.BLUEDEBRIS | Flag.GREENDEBRIS | Flag.REDDEBRIS | Flag.HARMFULDEBRIS)) {
            var v1 = ent.pos.location.x - camera.position.x;
            var v2 = ent.pos.location.y - camera.position.y;
            var distance = Math.sqrt(v1*v1 + v2*v2);

            if (distance > 10000) {
                destroyEntity(ent, ents, scene);
            }
        }
    });
}