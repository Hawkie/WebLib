import { IParticleField, FieldGenRemMove } from "./FieldComponent";
import { DrawContext } from "../../gamelib/Views/DrawContext";
import { DisplayField } from "../../gamelib/Components/ParticleFieldComponent";
import { Transforms } from "../../gamelib/Physics/Transforms";


export interface ISplat {
    readonly splatParticleField: IParticleField;
    readonly splatDuration: number;
    readonly splatTime: number;
    readonly soundFilename: string;
}

export function CreateSplat(): ISplat {
    return {
        splatParticleField: {
            accumulatedModifier: 0,
            toAdd: 0,
            particles: [],
            particleSize: 3, // config
            particlesPerSecond: 50, // config
            maxParticlesPerSecond: 50, // config
            particleLifetime: 5, // config
            gravityStrength: 10, // config
        },
        splatDuration: 5,
        splatTime: 0,
        soundFilename: "res/sound/explosion.wav",
    };
}

export function DisplaySplat(ctx: DrawContext, explosion: ISplat): void {
    ctx.colour("#f22");
    DisplayField(ctx, explosion.splatParticleField.particles);
    ctx.restore();
}

export function ResetSplat(splat: ISplat): ISplat {
    return {...splat,
        splatTime: 0
    };
}

export function UpdateSplat(timeModifier: number, splat: ISplat,
        crashed: boolean,
        x: number, y: number): ISplat {
    let generate: boolean = false;
    let accumulatedTime: number = 0;
    let e: ISplat = splat;
    if (crashed) {
        accumulatedTime = splat.splatTime + timeModifier;
        if (accumulatedTime < splat.splatDuration) {
            generate = true;
        }
    }
    // change of state
    e = {...e,
        splatTime: accumulatedTime,
        splatParticleField: FieldGenRemMove(timeModifier,
            e.splatParticleField, generate, 50, 5,
            (now: number) => {
                return {
                    x: x + Transforms.random(-2, 2),
                    y: y + Transforms.random(-2, 2),
                    Vx: Transforms.random(-10, 10),
                    Vy: Transforms.random(10, 20),
                    born: now,
                    size: 2,
            };
        })
    };
    return e;
}


