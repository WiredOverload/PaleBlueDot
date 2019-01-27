import { 
     PositionComponent,
     VelocityComponent,
     AnimationComponent,
     ControllableComponent,
     HitBoxComponent,
     HurtBoxComponent,
     TimerComponent,
     TiledSpriteComponent,
     ResourcesComponent,
} from "./corecomponents";

export enum Flag {
     REDDEBRIS = 1 << 0,
     BLUEDEBRIS = 1 << 1,
     GREENDEBRIS = 1 << 2,
     BEACON = 1 << 3,
}

/**
 * Class to represent an entity in the game. No constructor as an entity can
 * comprise of as many or as little of the properties listed here. Each component
 * should have a corresponding system that handles the game logic needed to update
 * the properties within the component.
 */
export class Entity {
     public flags: Flag;
     public resources: ResourcesComponent;
     public pos: PositionComponent;
     public vel: VelocityComponent;
     public sprite: THREE.Mesh;
     public anim: AnimationComponent;
     // public graphic: PIXI.Graphics;
     public control: ControllableComponent;
     public hitBox: HitBoxComponent;
     public hurtBox: HurtBoxComponent;
     public timer: TimerComponent;
     public tiledSprite: TiledSpriteComponent;
}
