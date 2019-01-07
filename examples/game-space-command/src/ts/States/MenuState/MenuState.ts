import { IMenuComponent, UpdateMenu, SoundMenu, DisplayMenu } from "../../Components/MenuComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IStateProcessor } from "../../../../../../src/ts/gamelib/State/StateProcessor";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayField, FieldGenMove } from "../../../../../../src/ts/gamelib/Components/ParticleFieldComponent";
import { DisplayTitle, DisplayText } from "../../../../../../src/ts/gamelib/Components/TitleComponent";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { AsteroidAssets } from "../../Assets/assets";
import { IEventState } from "../../../../../../src/ts/gamelib/Events/EventProcessor";


export interface IMenuState {
    readonly title: string;
    readonly font: string;
    readonly fontSize: number;
    readonly starField1: IParticleField;
    readonly starField2: IParticleField;
    readonly menu: IMenuComponent;
}

// when creating a game state - create the data and then bind to the objects
export function CreateGameStateMenu(): IStateProcessor<IMenuState> {
    return {
        id: 0,
        name: "Main Menu",
        sound: SoundMenuState,
        display: DisplayMenuState,
        input: InputMenuState,
        update: UpdateMenuState,
        next: (state: IMenuState) => {
            if (state.menu.selected) {
                return state.menu.itemFocus;
            }
            return undefined;
        }
    };
}

export function CreateMenuState(items: string[]): IMenuState {
    return {
        title: "Menu",
        font: "Arial",
        fontSize: 18,
        starField1: CreateField(true, 2, 2, 1),
        starField2: CreateField(true, 2, 2, 2),
        menu: {
            lastMoved: 0,
            selected: false,
            itemFocus: 0,
            moved: false,
            font: "Arial",
            fontSize: 16,
            menuItems: items,
        },
    };
}

// map whole state to view/ctx functions
export function DisplayMenuState(ctx: DrawContext, state: IMenuState): void {
    ctx.clear();
    DisplayField(ctx, state.starField1.particles);
    DisplayField(ctx, state.starField2.particles);
    DisplayTitle(ctx, state.title);
    DisplayMenu(ctx, 200, 100, state.menu);
    DisplayText(ctx, "<q>: up, <a>: down:, <enter>: select phase", 20, AsteroidAssets.assets.height-20);
}

export function UpdateMenuState(state:IMenuState, timeModifier: number): IMenuState {
    return {...state,
        starField1: FieldGenMove(timeModifier, state.starField1, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        starField2: FieldGenMove(timeModifier, state.starField2, true, 3, (now: number) => {
            return {
                x: Transforms.random(0, 512),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(30, 50),
                born: now,
                size: 2,
            };
        }),
    };
}

export function SoundMenuState(state: IMenuState): IMenuState {
    return {...state,
        menu: SoundMenu(state.menu, AsteroidAssets.assets.timePortal, AsteroidAssets.assets.blast)
    };
}

export function InputMenuState(menuState: IMenuState, eState: IEventState, timeModifier: number): IMenuState  {
    return {...menuState,
        menu: UpdateMenu(menuState.menu, eState)
    };
}