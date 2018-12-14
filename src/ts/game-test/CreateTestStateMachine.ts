import { IStateProcessor } from "../gamelib/State/StateProcessor";
import { IEventState, CreateEventState, Click } from "../gamelib/Events/EventProcessor";
import { DrawContext } from "../gamelib/Views/DrawContext";
import { DrawText } from "../gamelib/Views/TextView";
import { DrawNumber } from "../gamelib/Views/ValueView";
import { DrawCircle } from "../gamelib/Views/CircleView";
import { DrawLine } from "../gamelib/Views/LineView";
import { DrawRectangle } from "../gamelib/Views/RectangleView";
import { Assets } from "./assets";
import { DisplayTitle } from "../gamelib/Components/TitleComponent";

export interface ITestState {
    title: string;
    errors: string[];
    controls: IEventState;
}

export function CreateTestState(): ITestState {
    return {
        title: "Test State",
        errors: [],
        controls: CreateEventState(),
    };
}

export function CreateTestStateMachine(): IStateProcessor<ITestState> {
    return {
        id: 1,
        name: "test",
        sound: SoundTest,
        display: DisplayTest,
        input: InputTest,
        update: EmptyUpdate,
        next: (state: ITestState) => { return undefined; }
    };
}

export function EmptyInput<T>(state:T, eState:IEventState, timeModifier:number): T {
    return state;
}

export function EmptyUpdate<T>(state: T, timeModifier: number): T {
    return state;
}

export function SoundTest(state: ITestState): ITestState {
    return {...state,
        errors: [Assets.assets.cinematic.display(), Assets.assets.explosion.display()]
    };
}

export function InputTest(state:ITestState, eState:IEventState, timeModifier:number): ITestState {
    return {...state,
        controls: Click(state.controls, eState),
    };
}

export function DisplayTest(ctx: DrawContext, state:ITestState): void {
    ctx.clear();
    DisplayTitle(ctx, state.title);
    let y: number = 100;
    state.errors.forEach(e => { DrawText(ctx, 100, y, e); y+=15;});

    // keys
    if (state.controls.keys !== undefined) {
        state.controls.keys.forEach(k => { DrawNumber(ctx, 100, y, k); y+=15;});
    }

    // draw drag line
    if (state.controls.start !== undefined && state.controls.current !== undefined && state.controls.press) {
        DrawLine(ctx, state.controls.start.x, state.controls.start.y, state.controls.current.x, state.controls.current.y);
    }
    let rSize: number = 10;
    if (state.controls.press) {
        rSize = 5;
    }
    DrawRectangle(ctx, 50, 100, rSize, rSize);
    if (state.controls.click) {
        DrawRectangle(ctx, state.controls.end.x, state.controls.end.y, 30, 30);
    }

    if (state.controls.touches !== undefined) {
        DrawNumber(ctx, 100, 80, state.controls.touches.length);
        DrawNumber(ctx, 150, 80, state.controls.end.x);
        DrawNumber(ctx, 170, 80, state.controls.end.y);
        for (let i:number=0;i<state.controls.touches.length;i++) {
            DrawCircle(ctx, state.controls.touches[i].clientX, state.controls.touches[i].clientY,30);
        }
    }
}

