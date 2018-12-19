import { IParticleField, FieldGenRemMove } from "../../../../../../src/ts/gamelib/Components/FieldComponent";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { DisplayField } from "../../../../../../src/ts/gamelib/Components/ParticleFieldComponent";
import { DrawFlash } from "../../../../../../src/ts/gamelib/Views/ScreenFlashView";
import { IncreaseCounter, Toggle, AddElapsedTime } from "../../../../../../src/ts/gamelib/Actors/Helpers/Counter";
import { Game } from "../../../../../../src/ts/gamelib/1Common/Game";

export interface IExplosion {
    readonly explosionParticleField: IParticleField;
    readonly explosionDuration: number;
    readonly explosionTime: number;
    readonly soundFilename: string;
}

export function CreateExplosion(): IExplosion {
    return {
        explosionParticleField: {
            accumulatedModifier: 0,
            toAdd: 0,
            particles: [],
            particleSize: 3, // config
            particlesPerSecond: 50, // config
            maxParticlesPerSecond: 50, // config
            particleLifetime: 5, // config
            gravityStrength: 0, // config
        },
        explosionDuration: 5,
        explosionTime: 0,
        soundFilename: "res/sound/explosion.wav",
    };
}

export function DisplayExplosion(ctx: DrawContext, explosion: IExplosion, x: number, y: number): void {
    ctx.colour("#f84");
    DisplayField(ctx, explosion.explosionParticleField.particles);
    ctx.restore();
}

export function UpdateExplosion(timeModifier: number, explosion: IExplosion,
        crashed: boolean,
        x: number, y: number, Vx: number, Vy: number): IExplosion {
    let generate: boolean = false;
    let accumulatedTime: number = 0;
    let e: IExplosion = explosion;
    if (crashed) {
        accumulatedTime = explosion.explosionTime + timeModifier;
        if (accumulatedTime < explosion.explosionDuration) {
            generate = true;
        }
    }
    // change of state
    e = {...e,
        explosionTime: accumulatedTime,
        explosionParticleField: FieldGenRemMove(timeModifier,
            e.explosionParticleField, generate, 50, 5,
            (now: number) => {
                return {
                    x: x + Transforms.random(-2, 2),
                    y: y + Transforms.random(-2, 2),
                    Vx: Vx + Transforms.random(-10, 10),
                    Vy: Vy + Transforms.random(-10, 10),
                    born: now,
                    size: 3,
            };
        })
    };
    return e;
}


