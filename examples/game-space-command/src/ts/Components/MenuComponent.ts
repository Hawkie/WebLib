import { DrawContext } from "../../../../../src/ts/gamelib/Views/DrawContext";
import { DrawText } from "../../../../../src/ts/gamelib/Views/TextView";
import { IAudioElement } from "../../../../../src/ts/gamelib/Elements/AudioElement";
import { IEventState } from "../../../../../src/ts/gamelib/Events/EventProcessor";
import { Keys } from "../../../../../src/ts/gamelib/Events/KeyHandler";

// immutable data object
export interface IMenuComponent {
    readonly lastMoved: number;
    readonly selected: boolean;
    readonly itemFocus: number;
    readonly moved: boolean;
    readonly font: string;
    readonly fontSize: number;
    readonly menuItems: string[];
}


export function DisplayMenu(ctx: DrawContext, x: number, y: number, menu: IMenuComponent): void {
    // todo: crude for loop
    for (let i: number = 0; i < menu.menuItems.length; i++) {
        if (menu.itemFocus === i) {
            DrawText(ctx, x-20, y, ">", menu.font, menu.fontSize);
        }
        DrawText(ctx, x, y, menu.menuItems[i], menu.font, menu.fontSize);
        y += 50;
    }
}

export function SoundMenu(menuState: IMenuComponent, music: IAudioElement, changeSound: IAudioElement): IMenuComponent {
    music.playOnce();
    if (menuState.moved) {
        changeSound.replay();
        // turn off moved once sound played (can optimise this in replay perhaps?)
        return {...menuState,
            moved: false
        };
    }
    // unchanged state
   return menuState;
}

// pure function that takes a menu action and updates the selected text. returns new menu
export function UpdateMenu(menu: IMenuComponent, eState: IEventState): IMenuComponent {
    let now: number = Date.now();
    let focus: number = menu.itemFocus;
    let moved: boolean = false;
    let selected: boolean = false;
    if (now - menu.lastMoved > 150) {
        if (eState.keys.indexOf(Keys.Q) > -1) {
            focus = Math.max(menu.itemFocus - 1, 0);
            moved = true;
        }
        if (eState.keys.indexOf(Keys.A) > -1) {
            focus = Math.min(menu.itemFocus + 1, menu.menuItems.length - 1);
            moved = true;
        }
        if (eState.keys.indexOf(Keys.Enter) > -1) {
            selected = true;
        }
        // change state of menu focus
        return {...menu,
            itemFocus: focus,
            selected: selected,
            lastMoved: now,
            moved: moved,
        };
    }
    // return menu unchanged
    return menu;
}
