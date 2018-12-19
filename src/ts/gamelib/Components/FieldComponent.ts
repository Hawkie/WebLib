import { MoveWithVelocity, IMoveable } from "../Actors/Movers";
import { DrawContext } from "../Views/DrawContext";
import { DrawRectangle } from "../Views/RectangleView";
import { IField, IParticle } from "./ParticleFieldComponent";
import { FieldGenerate } from "../Actors/FieldGenerator";
import { FieldMoveParticlesWithVelocity, FieldAccParticlesWithGravity } from "../Actors/FieldMover";
import { FieldRemoveParticle } from "../Actors/FieldParticleRemover";


export interface IParticleField extends IField<IParticle> {
    readonly particlesPerSecond: number;
    readonly maxParticlesPerSecond: number;
    readonly particleLifetime: number;
    readonly particleSize: number;
    readonly gravityStrength: number;
}



export function CreateField(on: boolean,
    particlesPerSecond: number, // this will go (you spec all this in the update)
    maxParticlesPerSecond: number, // this will go (you spec all this in the update)
    particleSize: number = 2, // this will go (you spec all this in the update)
    particleLifetime: number = undefined, // this will go (you spec all this in the update)
    gravityStrength: number = 0): IParticleField {
    return {
        particles: [],
        accumulatedModifier: 0,
        toAdd: 0,
        particlesPerSecond: particlesPerSecond, // this will go (you spec all this in the update)
        maxParticlesPerSecond: maxParticlesPerSecond, // this will go (you spec all this in the update)
        particleLifetime: particleLifetime, // this will go (you spec all this in the update)
        particleSize: particleSize, // this will go (you spec all this in the update)
        gravityStrength: gravityStrength, // this will go (you spec all this in the update)
    };
}

// map field data (particles[]) to particle view
// export function DisplayField(ctx: DrawContext, particles: IParticle[]): void {
//     particles.forEach(p =>  DisplayRectangle(ctx, p.x, p.y, p.size, p.size));
// }

export function FieldGenRemMove<P extends IParticle, F extends IField<P>>(timeModifier: number,
        field: F,
        on: boolean,
        particlesPerSecond: number,
        particleLifetime: number,
        func: (now: number) => P): F {
    let f: F = field;
    if (on) {
        f = FieldGenerate(timeModifier, f, on, particlesPerSecond, func);
    }
    f = FieldRemoveParticle(timeModifier, f, particleLifetime);
    f = FieldMoveParticlesWithVelocity(timeModifier, f);
    return FieldAccParticlesWithGravity(timeModifier, f);
}





