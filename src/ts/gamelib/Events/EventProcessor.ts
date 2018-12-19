import { OnKey } from "./KeyHandler";
import { OnTouch } from "./TouchHandler";
import { OnMouse } from "./MouseHandler";
import { ICoordinate } from "../DataTypes/Coordinate";
import { IAssets } from "../../../../examples/game-air-rider/src/ts/Assets/assets";

export interface IEventState {
    readonly soundInit: boolean;
    readonly keys: ReadonlyArray<number>;
    readonly buttons: number;
    readonly start: ICoordinate;
    readonly current: ICoordinate;
    readonly end: ICoordinate;
    readonly touchForce: number;
    readonly touches: TouchList;
    readonly press: boolean;
    readonly click: boolean;
    readonly log: string;
}

export function CreateEventState(): IEventState {
    return {
        soundInit: false,
        keys: [],
        buttons: undefined,
        start: undefined,
        current: undefined,
        end: undefined,
        touchForce: undefined,
        touches: undefined,
        press: false,
        click: false,
        log: "",
    };
}

export function Click(oldState: IEventState, newState: IEventState): IEventState {
    return {...newState,
        click: DownCheck(oldState.press, newState.press),
    };
}

export function DownCheck(oldDown: boolean, newDown: boolean): boolean {
    if (oldDown && !newDown) {
        return true;
    }
    return false;
}

export class EventProcessor {
    eState: IEventState = CreateEventState();

    constructor(private document: Document,
        private element: HTMLElement,
        private assets: IAssets) {
        this.addListeners();
    }

    private _OnKey(e: KeyboardEvent): void {
        this.eState = OnKey(this.eState, e);
    }

    private _OnTouch(e: TouchEvent): void {
        if (e.type === "mouseup") {
            this.assets.safariAudio();
        }
        this.eState = OnTouch(this.eState, this.element, e);
    }

    private _OnMouse(e: MouseEvent): void {
        if (e.type === "mouseup") {
            this.assets.safariAudio();
        }
        this.eState = OnMouse(this.eState, this.element, e);
    }

    private addListeners(): void {
        // keys
        this.document.addEventListener("keyup", this._OnKey.bind(this), false);
        this.document.addEventListener("keydown", this._OnKey.bind(this), false);
        // this.window.addEventListener("keypress", kd, false);
        // this.window.addEventListener("onkeydown", kd, false);

        // touch
        this.document.addEventListener("touchstart", this._OnTouch.bind(this), false);
        this.document.addEventListener("touchmove", this._OnTouch.bind(this), false);
        this.document.addEventListener("touchend", this._OnTouch.bind(this), false);

        this.document.addEventListener("mousedown", this._OnMouse.bind(this), false);
        this.document.addEventListener("mousemove", this._OnMouse.bind(this), false);
        this.document.addEventListener("mouseup", this._OnMouse.bind(this), false);
        this.document.addEventListener("click", this._OnMouse.bind(this), false);
    }
}




