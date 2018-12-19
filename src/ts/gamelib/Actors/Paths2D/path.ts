import { ICoordinate } from "../../DataTypes/Coordinate";
import { Transforms } from "../../Physics/Transforms";

export interface ITime {
    t: number;
}

export function time<TLocated extends ITime>(located: TLocated,
    timeModifier: number): TLocated {
   const t: number = located.t + timeModifier;
   return Object.assign({}, located, {
       t: t,
   });
}

// paths
export function circular(t: number, amp: number, freq: number): ICoordinate {
    return {
        x: amp * Math.sin(t * freq),
        y: amp * Math.cos(t * freq),
    };
}

export function sine(t: number, amp: number, freq: number): ICoordinate {
    return {
        x: t,
        y: amp * Math.sin(t * freq)
    };
}

export function line(t: number, angle: number, speed: number): ICoordinate {
    let c: ICoordinate = Transforms.VectorToCartesian(angle, 1);
    return {
        x: c.x * t * speed,
        y: c.y * t * speed,
    };
}