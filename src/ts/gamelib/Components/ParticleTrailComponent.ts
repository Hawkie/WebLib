import { DrawContext } from "../Views/DrawContext";
import { DrawRectangle } from "../Views/RectangleView";
import { circular, sine, time, line } from "../Actors/Paths2D/path";
import { ICoordinate } from "../DataTypes/Coordinate";
import { combine, rotate } from "../DataTypes/Path";
import { DrawGraphic } from "../Views/GraphicView";
import { Assets } from "../../../../examples/game-test/src/ts/assets";

export interface IParticleTrail {
    readonly x: number;
    readonly y: number;
    readonly t: number;
    readonly angle: number;
    readonly lag: number;
    readonly length: number;
}

export function CreateParticleTrail(x: number, y: number): IParticleTrail {
    let particle: IParticleTrail = {
        x: x,
        y: y,
        t: 0,
        angle: 90,
        lag: 0.01,
        length: 10,
    };
    return particle;
}

export function DisplayParticleTrail(ctx: DrawContext, p: IParticleTrail): void {
    for (let i: number = 0; i < p.length; i++) {
        const tShifted: number = p.t - i*i *p.lag;
        let l: ICoordinate = line(tShifted, p.angle, 10);
        let s: ICoordinate = sine(tShifted, 100, 1);
        let sa: ICoordinate = rotate(s, p.angle - 90);
        const coord: ICoordinate = combine(l, sa);
        DrawRectangle(ctx, p.x + coord.x, p.y + coord.y, 2, 2);
    }
}

export function UpdateParticleTrail(p: IParticleTrail, timeModifier: number): IParticleTrail {
    const newP: IParticleTrail = time(p, timeModifier);
    return newP;
}