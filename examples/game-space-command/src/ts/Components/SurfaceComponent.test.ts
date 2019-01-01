
import { generatePoint, ISurfaceGeneration, TestFlat, addSurface, PopSurfaceBuffer, FindIndex } from "./SurfaceComponent";
import { ICoordinate } from "../../../../../src/ts/gamelib/DataTypes/Coordinate";
import { ISurface } from "../../../../game-air-rider/src/ts/Components/SurfaceComponent";

const gen: ISurfaceGeneration = {
    lower: -10,
    upper: 10,
    resolution: 10,
    flatChance: 1,
};

test("generate X", () => {
    const X: number = 100;
    const Y: number = 100;
    const result: ICoordinate = generatePoint(X, Y, gen);
    expect(result.x).toBe(100);
});

test("generate Y", () => {
    const X: number = 100;
    const Y: number = 100;
    const result: ICoordinate = generatePoint(X, Y, gen);
    expect(result.y).toBeLessThan(110);
});

const surfaceNotFlat: ISurface = {
    addedLeft: 0,
    points: [{x:0,y:20}, {x:10, y:25}, {x:20, y:30}],
    surfaceGenerator: gen,
};

test("testNotFlat", () => {
    const X: number = 10;
    const result: boolean = TestFlat(surfaceNotFlat, X);
    expect(result).toBe(false);
});

const surfaceFlat: ISurface = {
    addedLeft: 0,
    points: [{x:0,y:20}, {x:10, y:20}, {x:20, y:20}],
    surfaceGenerator: gen,
};

test("testFlat", () => {
    const X: number = 10;
    const result: boolean = TestFlat(surfaceFlat, X);
    expect(result).toBe(true);
});

const surfaceFlat2: ISurface = {
    addedLeft: 2,
    points: [{x:-20,y:20},{x:-10,y:20},{x:0,y:20}, {x:10, y:30}, {x:20, y:40}],
    surfaceGenerator: gen,
};

test("testFlatAddedWithAdded", () => {
    const X: number = -10;
    const result: boolean = TestFlat(surfaceFlat2, X);
    expect(result).toBe(true);
});

const surfaceFlat3: ISurface = {
    addedLeft: 2,
    points: [{x:-100, y: 1000}, {x:-20,y:20},{x:-10,y:20},{x:0,y:20}, {x:10, y:30}, {x:20, y:40}, {x:100, y: 1000}],
    surfaceGenerator: gen,
};

test("testFlatAddedWithBuffer", () => {
    const X: number = -10;
    const result: boolean = TestFlat(PopSurfaceBuffer(surfaceFlat3), X);
    expect(result).toBe(true);
});

test("findIndex", () => {
    const X: number = -10;
    const index: number = FindIndex(PopSurfaceBuffer(surfaceFlat3), X);
    expect(index).toBe(1);
});

const surfaceFlat4: ISurface = {
    addedLeft: 2,
    points: [{x:-100, y: 1000}, {x:-20,y:20},{x:-10,y:20},{x:0,y:20}, {x:10, y:30}, {x:20, y:40}, {x:100, y: 1000}],
    surfaceGenerator: gen,
};
test("findIndex", () => {
    const X: number = 0;
    const index: number = FindIndex(PopSurfaceBuffer(surfaceFlat3), X);
    expect(index).toBe(2);
});

