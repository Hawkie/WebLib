import { IShip, CreateShip, CrashShip, DisplayShip, ShipCopyToUpdated, ShipSounds } from "../../Components/Ship/ShipComponent";
import { ISurface, initSurface, DisplaySurface, addSurface } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { IAsteroidsControls, InputAsteroidControls, CreateControls } from "../../Components/AsteroidsControlsComponent";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayField, FieldGenMove } from "../../../../../../src/ts/gamelib/Components/ParticleFieldComponent";
import { Transforms } from "../../../../../../src/ts/gamelib/Physics/Transforms";
import { Game } from "../../../../../../src/ts/gamelib/1Common/Game";
import { AsteroidAssets } from "../../Assets/assets";
import { IEventState } from "../../../../../../src/ts/gamelib/Events/EventProcessor";


export interface ILandExplorerState {
    readonly title: string;
    readonly controls: IAsteroidsControls;
    readonly ship: IShip;
    readonly starField: IParticleField;
    readonly surface: ISurface;
}

export function CreateLandExplorer(ship: IShip, starfield: IParticleField, surface: ISurface): ILandExplorerState {
    return {
        title: "Space Commander",
        controls: CreateControls(),
        ship: ship,
        starField: starfield,
        surface: surface,
    };
}

export function DisplayLandExplorer(ctx: DrawContext, state: ILandExplorerState): void {
    DisplayShip(ctx, state.ship);
    DisplayField(ctx, state.starField.particles);
    DisplaySurface(ctx, state.surface);
}

export function LandExplorerSounds(state: ILandExplorerState): ILandExplorerState {
    ShipSounds(state.ship);
    // turn off any sound triggers - need to think about this
    return state;
}

export function StateCopyToUpdate(state: ILandExplorerState, timeModifier: number): ILandExplorerState {
    return {...state,
        ship: ShipCopyToUpdated(timeModifier, state.ship, state.controls),
        starField: FieldGenMove(timeModifier, state.starField, true, 2, (now: number) => {
            return {
                x: Transforms.random(0, AsteroidAssets.assets.width),
                y: 0,
                Vx: 0,
                Vy: Transforms.random(10, 30),
                born: now,
                size: 1,
            };
        }),
        surface: addSurface(state.surface, state.ship.x, AsteroidAssets.assets.width, state.surface.surfaceGenerator)
    };
}

export function StateCopyToControls(state: ILandExplorerState, eState: IEventState): ILandExplorerState {
    return {...state,
        controls: InputAsteroidControls(eState)
    };
}

export function TestPlayerHit(state: ILandExplorerState): ILandExplorerState {
    if (Transforms.hasPoint(state.surface.points.map(p => p), { x: 0, y: 0 }, state.ship)) {
            return {...state,
                ship: CrashShip(state.ship, 0, 0)
        };
    }
    return state;
}