import { IField } from "../Components/ParticleFieldComponent";
import { MoveWithVelocity, IMoveable } from "./Movers";
import { AccelerateWithForces } from "./Accelerator";
import { IVector } from "../DataTypes/Vector";

export interface IMovesWithVelocity extends IMoveable {
    Vx: number;
    Vy: number;
}

// pure function
export function FieldMoveParticlesWithVelocity<TParticle extends IMovesWithVelocity, TField extends IField<TParticle>>(
        timeModifier: number,
        particleField: TField): TField {
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> MoveWithVelocity(timeModifier, p, p.Vx, p.Vy))
    });
}

export function FieldAccParticlesWithGravity<TParticle extends IMovesWithVelocity, TField extends IField<TParticle>>(
     timeModifier: number,
     particleField: TField): TField {
    let gravity: IVector = { angle: 180, length: 10 };
    return Object.assign({}, particleField, {
        particles: particleField.particles.map((p)=> AccelerateWithForces(p, timeModifier, [gravity], 5))
    });
}