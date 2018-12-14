import { Coordinate, ICoordinate } from "../../gamelib/DataTypes/Coordinate";
import { Transforms } from "../../gamelib/Physics/Transforms";
import { DrawContext } from "../../gamelib/Views/DrawContext";
import { DrawPolyGraphic } from "../../gamelib/Views/PolyGraphic";
import { IShape } from "../../gamelib/DataTypes/Shape";

import { Assets } from "../Assets/assets";

export interface ISurfaceGeneration {
    readonly resolution: number;
    readonly lower: number;
    readonly upper: number;
    readonly flatChance: number;
}

export interface ISurface {
    readonly addedLeft: number;
    readonly points: ReadonlyArray<ICoordinate>;
    readonly surfaceGenerator: ISurfaceGeneration;
}

export function DisplaySurface(ctx: DrawContext, surface: ISurface): void {
    const shape: IShape = { offset: { x: 0, y: 0 }, points: surface.points};
    DrawPolyGraphic(ctx, 0, 0, shape, Assets.assets.grass);
}

export function generatePoint(x: number, yBase: number, generator: ISurfaceGeneration): ICoordinate {
    if (Math.random() < generator.flatChance) {
        console.log("Flat point created: " + yBase);
        return new Coordinate(x, yBase);
    }
    const yNew: number = yBase + Transforms.random(generator.lower, generator.upper);
    return new Coordinate(x, Math.max(0, yNew));
}

const baseY:number = 2000;

export function initSurface(width: number, generator: ISurfaceGeneration): ICoordinate[] {
    let endIndex: number = width / generator.resolution;
    let points: ICoordinate[] = [];
    // changing state
    points[0] = new Coordinate(0, 400);
    for (let i: number = 1; i < endIndex; i++) {
        let point: ICoordinate = generatePoint(i*generator.resolution, points[i-1].y, generator);
        points.push(point);
    }
    let first: Coordinate = points[0];
    let last: Coordinate = points[points.length - 1];

    // draw lines down to create polygon (for collision detection)
    points.unshift(new Coordinate(first.x - 100, baseY));
    points.push(new Coordinate(last.x + 100, baseY));
    return points;
}

export function addSurface(surface: ISurface,
    x: number,
    y: number,
    width: number,
    inputs: ISurfaceGeneration): ISurface {
    let newPoints: ICoordinate[] = surface.points.map(p => p);
    const zoomEffect: number = (Assets.assets.height-y)/(Assets.assets.height/2);
    let buffer: number = (width) * zoomEffect; // 256
    let left: number = x - (width/2); // 260 - 256 = -4  // 1 - 260 = - 259 // 400 - 260 = 140
    let right: number = x + buffer; // 260 + 256 = 516 // 1 + 260 = 261 // 400 + 260 = 660
    let leftIndex: number = Math.floor(left / inputs.resolution); // 0 // -25 // 14
    let rightIndex: number = Math.ceil(right / inputs.resolution); // 52 // 27 // 66
    let toAddLeft: number = leftIndex + surface.addedLeft; // -0.4 // -26.5
    let addedLeft: number = surface.addedLeft;
    if (toAddLeft < 0) {
        // remove first element (bottom point)
        newPoints.shift();
        var first: Coordinate = newPoints[0];
        for (let l: number = 0; toAddLeft < l; l--) {
            first = generatePoint(first.x + inputs.resolution, first.y, inputs);
            newPoints.unshift(first);
            addedLeft++;
        }
        // re add the bottom point
        newPoints.unshift(new Coordinate(first.x - 100, baseY));
    }
    let toAddRight: number = rightIndex - (newPoints.length - addedLeft - 3); // 51.6- 52 - 0 = -0.4
    console.log("length " + newPoints.length);
    console.log("rightIndex " + rightIndex);
    console.log("toAdd " + toAddRight);
    console.log("fromx " + x);
    if (toAddRight > 0) {
        // remove last point - bottom of surface shape
        newPoints.pop();
        var last: Coordinate = newPoints[newPoints.length - 1];
        for (let r: number = 0; toAddRight > r; r++) {
            last = generatePoint(last.x + inputs.resolution, last.y, inputs);
            // new Coordinate(last.x + inputs.resolution,
            //     last.y + Transforms.random(inputs.lower,inputs.upper));
            newPoints.push(last);
        }
        // re-add end point at bottom of shape
        newPoints.push(new Coordinate(last.x + 100, baseY));
    }
    return {...surface,
        points: newPoints,
        addedLeft: addedLeft,
    };
}

export function TestFlat(surface: ISurface,
    x: number, range: number = 3): boolean {
    let shipIndex: number = x / surface.surfaceGenerator.resolution;
    shipIndex = Math.round(shipIndex);
    // base point and addedLeft
    shipIndex = shipIndex - surface.addedLeft + 1;
    let height: number = surface.points[shipIndex].y;
    // check range of points either side
    for (let i:number = 0; i<range;i++) {
        let index: number = shipIndex - 1 + i;
        if (Math.abs(surface.points[index].y - height) > 2) {
            console.log("Surface Not Flat! Under ship:" + height + ". Point" +  surface.points[index].y);
            return false;
        }
    }
    return true;
}

