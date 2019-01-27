import { Entity, Flag } from "./entity";

export function resourceDrainSystem(earth: Entity, onDeath: (reason: string) => void) {
    // ents.forEach(ent => {
    //     if (ent.flags & (Flag.BLUEDEBRIS | Flag.GREENDEBRIS | Flag.REDDEBRIS | Flag.HARMFULDEBRIS)) {

    //     }
    // });
    let randomNum = Math.floor(Math.random()*100) + 1;

    if (randomNum === 25) {
        earth.resources.blue -= 10;
        if (earth.resources.blue <= 0) {
            onDeath("Ran out of blue resources!");
        }
    }

    if (randomNum === 50) {
        earth.resources.red -= 10;
        if (earth.resources.red <= 0) {
            onDeath("Ran out of red resources!");
        }
    }

    if (randomNum === 75) {
        earth.resources.green -= 10;
        if (earth.resources.green <= 0) {
            onDeath("Ran out of green resources!");
        }
    }
    
    if (earth.resources.update_bars) {
        earth.resources.update_bars(earth);
    }
}