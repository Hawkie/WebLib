import { MoveWithVelocity } from "../../../gamelib/Actors/Movers";
import { RotateShape, RotateAngle } from "../../../gamelib/Actors/Rotators";
import { IShip } from "./ShipComponent";
import { AccelerateWithForces } from "../../../gamelib/Actors/Accelerator";
import { IVector, Vector } from "../../../gamelib/DataTypes/Vector";

const maxHeight: number = 1000;
const maxMass: number = 180;
const maxTemp: number = 120;
// 18 * 10 equals gravity 180, 100, 0 to 240
// expecting values from 400 = low level to -1000 = high)
function LiftAcceleration(temp: number, height: number, descent: number): number {
    let hFactor: number = ((height+maxHeight)/maxHeight) + 1; // number between 1 and 2.
    return Math.max(0, temp * 0.8 * hFactor + descent);
}

export function MoveShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;

    // limit spin
    let spin: number = newShip.spin;
    if (newShip.angle > newShip.maxAngle) {
        spin = -(newShip.angle * newShip.angle);
    } else if (newShip.angle < -newShip.maxAngle) {
        spin = newShip.angle * newShip.angle;
    }

    newShip = RotateAngle(newShip, spin, timeModifier);
    newShip = RotateShape(timeModifier, newShip, spin);

    // only move ship if not crashed/ landed
    if (!newShip.crashed && !newShip.landed) {

        let accValue:number = LiftAcceleration(ship.temp, ship.y, ship.Vy) - newShip.mass * 10;

        // const tDiff: number = Math.max(0, 120 - newShip.temp;
        let lift: IVector = new Vector(0, accValue);
        // equation between temp and gravity
        // if temp > 120 then balloon is bouyant. if temp < 80 no bouyancy
        // let gravity: IVector = new Vector(180, newShip.mass * 10);

        // calc force by subtracting windSpeed - ship speed
        // higher you go faster the speed

        // higher you go faster the wind is
        let acc: IVector = new Vector(90, newShip.acc);

        newShip = AccelerateWithForces(newShip, timeModifier, [lift], newShip.mass);
        // wind, side forces don't act on mass because they are friction on balloon
        newShip = AccelerateWithForces(newShip, timeModifier, [acc], 1);
        newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    }
    return newShip;
}