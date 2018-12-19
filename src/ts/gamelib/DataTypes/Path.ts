import { ICoordinate } from "./Coordinate";
import { Transforms } from "../Physics/Transforms";

// todo: change to rest and reduce function
export function combine(c1: ICoordinate, c2: ICoordinate): ICoordinate {
    return {
        x: c1.x + c2.x,
        y: c1.y + c2.y,
    };
}

export function scale(c1: ICoordinate, f:number): ICoordinate {
    return {
        x: c1.x * f,
        y: c1.y * f,
    };
}

export function rotate(c1:ICoordinate, angle: number): ICoordinate {
    return Transforms.RotateCoordinates([c1], angle)[0];
}
