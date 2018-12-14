import { IEventState } from "./EventProcessor";

export enum Keys {
    // some handy key codes
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Esc = 27, // exit state

    SpaceBar = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    Num0 = 48,
    Num1 = 49,
    Num2 = 50,

    A = 65,
    D = 68,
    E = 69,
    N = 78,
    Q = 81,
    R = 82,
    S = 83,
    W = 87,
    X = 88, // zoom out
    Y = 89,
    Z = 90, // zoom in
}

export function OnKey(eState: IEventState, e: KeyboardEvent): IEventState {
    console.log("Key Down" + e.type + e.keyCode + e.key + e.code);
    if (e.type === "keydown") {
        return {...eState,
            keys: eState.keys.concat(e.keyCode)
        };
    } else if (e.type === "keyup") {
        return {...eState,
            keys: eState.keys.filter(k => k !== e.keyCode)
        };
    }
    console.log(this._keysDown);
    return eState;
}


