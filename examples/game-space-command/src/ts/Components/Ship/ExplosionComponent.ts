import { IParticleField, FieldGenRemMove } from "../../../../../../src/ts/gamelib/Components/FieldComponent";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayField } from "../../../../../../src/ts/gamelib/Components/ParticleFieldComponent";
import { DrawFlash } from "../../../../../../src/ts/gamelib/Views/ScreenFlashView";
import { Game } from "../../../../../../src/ts/gamelib/1Common/Game";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { Toggle } from "../../../../../../src/ts/gamelib/Actors/Helpers/Counter";
import { AsteroidAssets } from "../../Assets/assets";

export interface IExplosion {
    readonly explosionParticleField: IParticleField;
    readonly explosionDuration: number;
    readonly explosionTime: number;
    readonly soundFilename: string;
    readonly flash: {
        readonly flashScreenValue: number;
    };
    readonly flashCounter: number;
    readonly flashRepeat: number;
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
        flash: {
            flashScreenValue: 0,
        },
        flashCounter: 0,
        flashRepeat: 10,
    };
}

export function DisplayExplosion(ctx: DrawContext, explosion: IExplosion, x: number, y: number): void {
    DisplayField(ctx, explosion.explosionParticleField.particles);
    DrawFlash(ctx, 0, 0, AsteroidAssets.assets.width, AsteroidAssets.assets.height, explosion.flash.flashScreenValue);
}

export function UpdateExplosion(timeModifier: number, explosion: IExplosion,
        crashed: boolean,
        x: number, y: number, Vx: number, Vy: number): IExplosion {
    let generate: boolean = false;
    let accumulatedTime: number = 0;
    let flash: boolean = false;
    let e: IExplosion = explosion;
    let counter: number = e.flashCounter;
    if (crashed) {
        accumulatedTime = explosion.explosionTime + timeModifier;
        if (accumulatedTime < explosion.explosionDuration) {
            generate = true;
        }
        counter++;
        if (counter <= e.flashRepeat) {
            flash = true;
        }
    }
    // change of state
    e = {...e,
        explosionTime: accumulatedTime,
        flashCounter: counter,
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
    if (flash) {
        e = {...e,
            flash: {...e.flash,
                flashScreenValue: Toggle(e.flash.flashScreenValue)
            }
        };
    }
    return e;
}


