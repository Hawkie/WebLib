import { ICoordinate } from "../../DataTypes/Coordinate";

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
        x: amp * t * freq,
        y: amp * Math.sin(t * freq)
    };
}