import { DrawContext } from "../../gamelib/Views/DrawContext";
import { DrawRectangle } from "../../gamelib/Views/RectangleView";
import { circular, sine, time } from "../../gamelib/Actors/Paths2D/path";
import { ICoordinate } from "../../gamelib/DataTypes/Coordinate";

export interface IParticleTrail {
    readonly x: number;
    readonly y: number;
    readonly t: number;
    readonly lag: number;
    readonly length: number;
}

export function CreateParticleTrail(x: number, y: number): IParticleTrail {
    let particle: IParticleTrail = {
        x: x,
        y: y,
        t: 0,
        lag: 0.01,
        length: 10,
    };
    return particle;
}

export function DisplayParticleTrail(ctx: DrawContext, p: IParticleTrail): void {
    for (let i: number = 0; i < p.length; i++) {
        const coord: ICoordinate = sine(p.t - i*i *p.lag, 100, 1);
        DrawRectangle(ctx, coord.x, coord.y, 2, 2);
    }
}

export function UpdateParticleTrail(p: IParticleTrail, timeModifier: number): IParticleTrail {
    const newP: IParticleTrail = time(p, timeModifier);
    return newP;
}