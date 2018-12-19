import { IEventState } from "../../../../../src/ts/gamelib/Events/EventProcessor";
import { Keys } from "../../../../../src/ts/gamelib/Events/KeyHandler";

export interface IAsteroidsControls {
    readonly left: boolean;
    readonly right: boolean;
    readonly up: boolean;
    readonly fire: boolean;
    readonly zoomIn: boolean;
    readonly zoomOut: boolean;
    readonly exit: boolean;
}

export function CreateControls(): IAsteroidsControls {
    return {
            left: false,
            right: false,
            up: false,
            fire: false,
            zoomIn: false,
            zoomOut: false,
            exit: false,
    };
}

export function InputAsteroidControls(eState: IEventState): IAsteroidsControls {
    let up: boolean = false;
    let left: boolean = false;
    let right: boolean = false;
    let fire: boolean = false;
    let zoomIn: boolean = false;
    let zoomOut: boolean = false;
    let exit: boolean = false;
    if (eState.keys.indexOf(Keys.UpArrow) > -1) {
        up = true;
    }
    if (eState.keys.indexOf(Keys.LeftArrow) > -1) {
        left = true;
    }
    if (eState.keys.indexOf(Keys.RightArrow) > -1) {
        right = true;
    }
    if (eState.keys.indexOf(Keys.SpaceBar) > -1) {
        fire = true;
    }
    if (eState.keys.indexOf(Keys.Z) > -1) {
        zoomIn = true;
    }
    if (eState.keys.indexOf(Keys.X) > -1) {
        zoomOut = true;
    }
    if (eState.keys.indexOf(Keys.Esc) > -1) {
        exit = true;
    }
    return {
        left: left,
        right: right,
        up: up,
        fire: fire,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        exit: exit,
    };
}