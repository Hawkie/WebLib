import { Coordinate, ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { IShape, Shape } from "../../../gamelib/DataTypes/Shape";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { DrawContext } from "../../../gamelib/Views/DrawContext";
import { DrawPoly } from "../../../gamelib/Views/PolyViews";
import { IControls } from "../ControlsComponent";
import { IWeapon, PullTrigger, DisplayWeapon, CreateWeapon, RemoveBullet, StopBullet } from "./WeaponComponent";
import { IExhaust, ExhaustCopyToUpdated, DisplayExhaust, CreateExhaust } from "./ThrustComponent";
import { IExplosion, DisplayExplosion, CreateExplosion, UpdateExplosion } from "./ExplosionComponent";
import { Game } from "../../../gamelib/1Common/Game";
import { DrawPolyGraphic } from "../../../gamelib/Views/PolyGraphic";
import { DrawGraphic } from "../../../gamelib/Views/GraphicView";
import { DrawText } from "../../../gamelib/Views/TextView";
import { Assets } from "../../Assets/assets";

export interface IPhysics {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forwardThrust: number;
    readonly angle: number;
    readonly spin: number;
}

export interface IShip {
    readonly x: number;
    readonly y: number;
    readonly Vx: number;
    readonly Vy: number;
    readonly forwardThrust: number;
    readonly angle: number;
    readonly spin: number;
    readonly mass: number;
    readonly basketMass: number;
    readonly side: number;
    readonly guiDescent: number;
    readonly acc: number;
    readonly angularForce: number;
    readonly shape: IShape;
    readonly gravityStrength: number;
    readonly windStrength: number;
    // readonly balloonTemperature: number;
    readonly disabled: boolean;
    readonly broken: boolean;
    readonly fuel: number;
    readonly temp: number;
    readonly colour: string;
    readonly maxForwardForce: number;
    readonly maxRotationalSpeed: number;
    readonly maxSideForce: number;
    readonly maxAngle: number;
    readonly crashed: boolean;
    readonly landed: boolean;
    readonly trigger1: boolean;
    readonly weapon1: IWeapon;
    readonly exhaust: IExhaust;
    readonly explosion: IExplosion;
    move(ship: IShip, timeModifier: number): IShip;
}

const bSize:number = 3;

export function CreateShip(x: number, y: number,
    gravityStrength: number,
    move:(ship: IShip, timeModifier: number) => IShip): IShip {
    let squareShip: ICoordinate[] = [new Coordinate(bSize, bSize),
        new Coordinate(bSize, -bSize),
        new Coordinate(-bSize, -bSize),
        new Coordinate(-bSize, bSize)];

    let ship: IShip = {
        x: x,
        y: y,
        Vx: 2,
        Vy: 0,
        forwardThrust: 0,
        angle: 0,
        spin: 0,
        mass: 8 + 8,
        basketMass: 8,
        side: 0,
        guiDescent: 0,
        angularForce: 0,
        shape: {points: squareShip, offset: {x:0, y:0}},
        gravityStrength: gravityStrength,
        windStrength: 10,
        acc: 10,
        disabled: false,
        broken: false,
        fuel: 1000,
        temp: 80,
        colour: "#fff",
        maxForwardForce: 280,
        maxRotationalSpeed: 64,
        maxSideForce: 10,
        maxAngle: 10,
        landed: false,
        crashed: false,
        trigger1: false,
        weapon1: CreateWeapon(0.5, 0),
        exhaust: CreateExhaust(),
        explosion: CreateExplosion(),
        move: move,
    };
    return ship;
}

export function DisplayShip(ctx: DrawContext, ship: IShip): void {
    DrawPoly(ctx, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y, ship.shape);
    DisplayExhaust(ctx, ship.exhaust);
    DrawGraphic(ctx, ship.x-51, ship.y-123, Assets.assets.airBalloon);
    // // DrawGraphic(ctx, ship.x-48, ship.y-117, Assets.assets.airBalloon2);
    DisplayExplosion(ctx, ship.explosion, ship.x + ship.shape.offset.x, ship.y + ship.shape.offset.y);
    DisplayWeapon(ctx, ship.weapon1);
}

// doesn't change state
export function ShipSounds(ship: IShip): void {
    if (ship.crashed) {
        Assets.assets.explosion.playOnce();
    }
    if (ship.exhaust.thrustOn) {
        Assets.assets.thrust.play();
    } else {
        Assets.assets.thrust.pause();
    }
    if (ship.weapon1.fired) {
        Assets.assets.scream.replay();
    }
}

export function ShipCopyToUpdated(timeModifier: number, ship: IShip, controls: IControls): IShip {
    let newShip: IShip = ShipApplyControls(ship, controls, timeModifier);
    newShip = newShip.move(newShip, timeModifier);
    newShip = ShipSubComponents(newShip, timeModifier);
    return newShip;
}

const airTemp: number = 15;
const maxTemp: number = 120;

function Cool(temp: number, timeModifier: number): number {
    return Math.max(airTemp, temp - (temp/maxTemp) * timeModifier);
}

// less increase as temp increases (max = 2)
function Burner(temp: number, timeModifier: number): number {
    return temp + Math.pow((maxTemp/temp), 2) * timeModifier;
}

// fixed loss
function Turn(temp: number, timeModifier: number): number {
    return Math.max(airTemp, temp - (5 * timeModifier));
}

// fixed loss
function Dump(temp: number, timeModifier: number): number {
    return Math.max(airTemp, temp - (10 * timeModifier));
}

function ShipApplyControls(ship: IShip, controls: IControls, timeModifier: number): IShip {
    let spin: number = 0;
    let thrust: number = 0;
    let fireWeapon1: boolean = false;
    let fuel: number = ship.fuel;
    let temp: number = Cool(ship.temp, timeModifier);
    let side: number = 0;
    let guiDescent: number = ship.guiDescent;
    if (!ship.crashed) {
        guiDescent = ship.Vy;
    }
    if (!ship.crashed) {
        if (controls.left) {
            spin = -ship.maxRotationalSpeed;
            temp = Turn(temp, timeModifier);
            side = -ship.maxSideForce;
        }
        if (controls.right) {
            spin = ship.maxRotationalSpeed;
            temp = Turn(temp, timeModifier);
            side = ship.maxSideForce;
        }
        if (controls.up) {
            if (fuel > 0) {
                thrust = ship.maxForwardForce;
                fuel -= 10 * timeModifier;
                temp = Burner(temp, timeModifier);
            }
        }
        if (controls.down) {
            temp = Dump(temp, timeModifier);
        }
        if (controls.fire) {
            fireWeapon1 = true;
        }
    }
        // calc force by subtracting windSpeed - ship speed
    // higher you go faster the speed
    let windSheer: number = Math.min(5, Math.abs(ship.y-400) / 100);
    // let windSpeed: number = ship.windStrength * windSheer;
    // let friction: number = Math.pow(Math.max(0, ship.Vx - windSpeed), 2);
    // higher you go faster the wind is
    let acc: number = ship.windStrength * windSheer - ship.Vx + ship.side;
    return {...ship,
        spin: spin,
        // update thrust angle
        forwardThrust: thrust,
        trigger1: fireWeapon1,
        fuel: fuel,
        temp: temp,
        side: side,
        mass: ship.basketMass + ship.weapon1.remaining,
        guiDescent: guiDescent,
        acc: acc,

    };
}

function ShipSubComponents(ship: IShip, timeModifier: number): IShip {

    let w: IWeapon = PullTrigger(timeModifier, ship.weapon1,
        ship.trigger1, ship.x, ship.y, ship.Vx, ship.Vy, ship.angle, ship.weapon1.bulletVelocity);
    return {...ship,
        exhaust: ExhaustCopyToUpdated(timeModifier, ship.exhaust,
            ship.forwardThrust>0, ship.x, ship.y, ship.Vx, ship.Vy, ship.angle, ship.forwardThrust),
        weapon1: w,
        explosion: UpdateExplosion(timeModifier, ship.explosion, ship.crashed, ship.x, ship.y, ship.Vx, ship.Vy),
    };
}

export function CrashShip(ship: IShip, Vx: number, Vy: number): IShip {
    let guiDescent: number = ship.guiDescent;
    if (!ship.crashed) {
        guiDescent = ship.Vy;
    }
    return {...ship,
        crashed: true,
        Vx: Vx,
        Vy: Vy,
        guiDescent: guiDescent,
    };
}

// change to green
export function LandShip(ship: IShip): IShip {
    return {...ship,
        Vx: 0,
        Vy: 0,
        landed: true,
    };
}

export function ShipCopyToRemovedBullet(ship: IShip, bulletIndex: number,): IShip {
    return {...ship,
        weapon1: RemoveBullet(ship.weapon1, bulletIndex),
    };
}

export function ShipCopyToStopBullet(ship: IShip, bulletIndex: number,): IShip {
    return {...ship,
        weapon1: StopBullet(ship.weapon1, bulletIndex),
    };
}