import { RotateAngle, RotateShape } from "../../../../../../src/ts/gamelib/Actors/Rotators";
import { IVector, Vector } from "../../../../../../src/ts/gamelib/DataTypes/Vector";
import { AccelerateWithForces } from "../../../../../../src/ts/gamelib/Actors/Accelerator";
import { MoveWithVelocity } from "../../../../../../src/ts/gamelib/Actors/Movers";
import { UpdateConnection } from "../../../../../../src/ts/gamelib/Actors/CompositeAccelerator";
import { IShip } from "./ShipComponent";


export function MoveShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = RotateAngle(newShip, ship.spin, timeModifier);
    let forces: IVector = new Vector(newShip.angle, newShip.forwardThrust);
    newShip = AccelerateWithForces(newShip, timeModifier, [forces], newShip.mass);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}


export function MoveAttachedShip(ship: IShip, timeModifier: number): IShip {
    let newShip: IShip = ship;
    newShip = RotateAngle(newShip, ship.spin, timeModifier);
    let forces: IVector = new Vector(newShip.angle, newShip.forwardThrust);
    newShip = UpdateConnection(newShip, timeModifier, newShip.mass, [forces], 2);
    newShip = MoveWithVelocity(timeModifier, newShip, newShip.Vx, newShip.Vy);
    newShip = RotateShape(timeModifier, newShip, newShip.spin);
    return newShip;
}