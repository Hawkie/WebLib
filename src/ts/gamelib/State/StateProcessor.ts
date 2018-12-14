import { DrawContext } from "../1Common/DrawContext";
import { IEventState } from "../Events/EventProcessor";

export interface IStateProcessor<T> {
    id: number;
    name: string;
    sound(state: T, timeModifier: number): T;
    display(ctx: DrawContext, state:T): void;
    input(state:T, eState: IEventState, timeModifier: number): T;
    update(state:T, timeModifier: number): T;
    next(state: T): number;
}


