import { Keys } from "../../../../../src/ts/gamelib/Events/KeyHandler";
import { IEventState } from "../../../../../src/ts/gamelib/Events/EventProcessor";
import { Assets } from "../Assets/assets";


export interface IControls {
    readonly left: boolean;
    readonly right: boolean;
    readonly up: boolean;
    readonly down: boolean;
    readonly fire: boolean;
    readonly zoomIn: boolean;
    readonly zoomOut: boolean;
    readonly exit: boolean;
    readonly next: boolean;
}

export function CreateControls(): IControls {
    return {
            left: false,
            right: false,
            up: false,
            down: false,
            fire: false,
            zoomIn: false,
            zoomOut: false,
            exit: false,
            next: false,
    };
}

export function InputControls(eState: IEventState): IControls {
    let up: boolean = false;
    let down: boolean = false;
    let left: boolean = false;
    let right: boolean = false;
    let fire: boolean = false;
    let zoomIn: boolean = false;
    let zoomOut: boolean = false;
    let exit: boolean = false;
    let next: boolean = false;
    const keys: ReadonlyArray<number> = eState.keys;
    if (keys.indexOf(Keys.Q) > -1) {
        up = true;
    }
    if (eState.start !== undefined && eState.current !== undefined && eState.press) {
        if (eState.current.y < eState.start.y) {
            up = true;
        }
        if (eState.current.y > eState.start.y) {
            down = true;
        }
        if (eState.current.x - eState.start.x > 50) {
            right = true;
        }
        if (eState.current.x - eState.start.x < -50) {
            left = true;
        }
    }
    if (keys.indexOf(Keys.A) > -1) {
        down = true;
    }
    if (keys.indexOf(Keys.LeftArrow) > -1) {
        left = true;
    }
    if (keys.indexOf(Keys.RightArrow) > -1) {
        right = true;
    }
    if (keys.indexOf(Keys.SpaceBar) > -1) {
        fire = true;
    }
    if (eState.current !== undefined && eState.click) {
        if (eState.current.x > Assets.assets.width/2-25
            && eState.current.x < Assets.assets.width/2+25
            && eState.current.y > Assets.assets.height-50) {
                fire = true;
        }
    }
    if (keys.indexOf(Keys.Z) > -1) {
        zoomIn = true;
    }
    if (keys.indexOf(Keys.X) > -1) {
        zoomOut = true;
    }
    if (keys.indexOf(Keys.Esc) > -1) {
        exit = true;
    }
    // back button (implement as component)
    if (eState.current !== undefined && eState.click) {
        if (eState.current.x < 50 && eState.current.y < 50) {
            exit = true;
        }
    }
    if (keys.indexOf(Keys.N) > -1) {
        next = true;
    }
    // back button (implement as component)
    if (eState.current !== undefined && eState.click) {
        if (eState.current.x < 50 && eState.current.y > Assets.assets.height-50) {
            next = true;
        }
    }
    return {
        left: left,
        right: right,
        up: up,
        down: down,
        fire: fire,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        exit: exit,
        next: next,
    };
}