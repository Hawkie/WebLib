import { IShape, Shape } from "../../../../../../src/ts/gamelib/DataTypes/Shape";
import { IAsteroidPoints, IAsteroidStateStatic } from "../../States/Asteroids/AsteroidGameStatic";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { ICoordinate } from "../../../../../../src/ts/gamelib/DataTypes/Coordinate";
import { AsteroidAssets } from "../../Assets/assets";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DrawPolyGraphicAngled } from "../../../../../../src/ts/gamelib/Views/PolyGraphicAngled";
import { IImageElement } from "../../../../../../src/ts/gamelib/Elements/ImageElement";
import { MoveWithVelocity } from "../../../../../../src/ts/gamelib/Actors/Movers";
import { RotateShape } from "../../../../../../src/ts/gamelib/Actors/Rotators";
import { Wrap } from "../../../../../../src/ts/gamelib/Actors/Wrap";


export interface IAsteroid {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy :number;
    readonly angle:number;
    readonly spin:number;
    readonly size:number;
    readonly type:number;
    readonly shape: IShape;
    readonly graphic: string;
}

    // 5 different asteroid shapes

export function CreateAsteroid(shapes: IAsteroidPoints[], x: number, y: number, Vx: number, Vy:number, size: number): IAsteroid {
    let type:number = Transforms.random(0, 4);
    let points: number[] = shapes[type].points;
    let coords: ICoordinate[] = Transforms.ArrayToPoints(points);
    let scaledShape: ICoordinate[] = Transforms.Scale(coords, size, size);
    let shape: IShape = new Shape(scaledShape);
    return {
        x: x,
        y: y,
        Vx: Vx + Transforms.random(-40, 40),
        Vy: Vy + Transforms.random(-40, 40),
        angle: Transforms.random(0, 359),
        spin:Transforms.random(-100, 100),
        size: size,
        type: type,
        shape: shape,
        graphic: "res/img/terrain.png",
    };
}

export function CreateAsteroidData(asteroidStateStatic: IAsteroidStateStatic, size: number): IAsteroid {
    let xy: number = Transforms.random(0, 3);
    let x: number = Transforms.random(0,512), y: number = Transforms.random(0, 480);
    let boundary: number = 100;
    if (xy === 0) {
        x = Transforms.random(0, boundary);
    } else if (xy === 1) {
        x = Transforms.random(AsteroidAssets.assets.width - boundary, AsteroidAssets.assets.width);
    } else if (xy === 2) {
        y = Transforms.random(0, boundary);
    } else if (xy === 3) {
        y = Transforms.random(AsteroidAssets.assets.height - boundary, AsteroidAssets.assets.height);
    }
    return CreateAsteroid(asteroidStateStatic.shapes, x,y, 0, 0, size);
}

export function DisplayAsteroid(ctx: DrawContext, asteroid: IAsteroid, graphic: IImageElement): void {
    DrawPolyGraphicAngled(ctx, asteroid.x + asteroid.shape.offset.x,
        asteroid.y + asteroid.shape.offset.y,
        asteroid.shape,
        asteroid.angle,
        graphic);
}

export function UpdateAsteroid(timeModifier: number, asteroid: IAsteroid): IAsteroid {
    let moved: IAsteroid = MoveWithVelocity(timeModifier, asteroid, asteroid.Vx, asteroid.Vy);
    let spun: IAsteroid = RotateShape(timeModifier, moved, moved.spin);
    let wrapped: IAsteroid = {...spun,
        x: Wrap(spun.x, 0, AsteroidAssets.assets.width),
        y: Wrap(spun.y, 0, AsteroidAssets.assets.height)
    };
    return wrapped;
}