import { IParticleField, FieldGenRemMove } from "../../../../../../src/ts/gamelib/Components/FieldComponent";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { ICoordinate } from "../../../../../../src/ts/gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayField, FieldGenMove } from "../../../../../../src/ts/gamelib/Components/ParticleFieldComponent";

export interface IExhaust {
    readonly thrustOn: boolean;
    readonly exhaustParticleField: IParticleField;
    readonly soundFilename: string;
}

export function CreateExhaust(): IExhaust {
    return {
        thrustOn: false,
        exhaustParticleField: {
            accumulatedModifier: 0,
            toAdd: 0,
            particles: [],
            particleSize: 1, // config
            particlesPerSecond: 20, // config
            maxParticlesPerSecond: 50, // config
            particleLifetime: 1, // config
            gravityStrength: 0, // config
        },
        soundFilename: "res/sound/thrust.wav"
    };
}

export function DisplayExhaust(ctx: DrawContext, exhaust: IExhaust): void {
    ctx.colour("#fa2");
    DisplayField(ctx, exhaust.exhaustParticleField.particles);
    ctx.restore();
}

export function ExhaustCopyToUpdated(timeModifier: number,
        exhaust: IExhaust,
        on: boolean,
        x: number, y: number, Vx: number, Vy: number,
        angle: number,
        length: number): IExhaust {
    let velocity: ICoordinate = Transforms.VectorToCartesian(angle + Transforms.random(-5, 5),
    100 + Transforms.random(-5, 5));
    return {...exhaust,
        thrustOn: on,
        exhaustParticleField: FieldGenRemMove(timeModifier,
            exhaust.exhaustParticleField, on, 50, 0.5,
            (now: number) => {
                return {
                    x: x + Transforms.random(-2, 2),
                    y: y + Transforms.random(-2, 2),
                    Vx: Vx + velocity.x,
                    Vy: Vy + velocity.y,
                    born: now,
                    size: 2,
            };
        })};
}