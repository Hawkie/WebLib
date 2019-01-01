import { ILandExplorerState, CreateLandExplorer, StateCopyToUpdate,
    TestPlayerHit, LandExplorerSounds, StateCopyToControls, DisplayLandExplorer } from "./LandExplorerState";
import { IView, CreateView, Zoom, DisplayView } from "../../Components/ViewPortComponent";
import { ISurfaceGeneration, initSurface, ISurface, TestFlat, PopSurfaceBuffer } from "../../Components/SurfaceComponent";
import { IShip, CreateShip } from "../../Components/Ship/ShipComponent";
import { AsteroidAssets } from "../../Assets/assets";
import { MoveShip, TestLandingSpeed } from "../../Components/Ship/MovementComponent";
import { ICoordinate } from "../../../../../../src/ts/gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayTitle } from "../../../../../../src/ts/gamelib/Components/TitleComponent";
import { IEventState } from "../../../../../../src/ts/gamelib/Events/EventProcessor";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { DrawText } from "../../../../../../src/ts/gamelib/Views/TextView";
import { VerticallyAligned } from "../../../../../../src/ts/gamelib/Actors/Helpers/Angle";

export interface ILandExplorerGameState {
    landState: ILandExplorerState;
    view: IView;
}

export function CreateGameStateLandExplorer(): ILandExplorerGameState {
    let surfaceGenerator: ISurfaceGeneration = {
        resolution: 5,
        upper: 5,
        lower: -5,
        flatChance: 0.5,
    };
    let ship: IShip = CreateShip(AsteroidAssets.assets.width/2, AsteroidAssets.assets.height/2, 10, false,
        MoveShip);
    let points: ICoordinate[] = initSurface(AsteroidAssets.assets.width, surfaceGenerator);
    let surface: ISurface = {
        addedLeft: 0,
        points: points,
        surfaceGenerator: surfaceGenerator,
    };
    let starfield: IParticleField = CreateField(true, 1, 1);
    let state: ILandExplorerState = CreateLandExplorer(ship, starfield, surface);
    let view: IView = CreateView(true);
    return {
        landState: state,
        view: view,
    };
}

export function Update(state: ILandExplorerGameState, timeModifier: number): ILandExplorerGameState {
    let newState: ILandExplorerState = state.landState;
    // combine our three state changes from one update function
    newState = StateCopyToUpdate(newState, timeModifier);
    newState = TestPlayerHit(newState);
    return {...state,
        landState: newState,
        view: Zoom(state.view, newState.controls.zoomIn, newState.controls.zoomOut)
    };
}

export function Sounds(state: ILandExplorerGameState): ILandExplorerGameState {
    return {...state,
        landState: LandExplorerSounds(state.landState),
    };
}

export function Input(state: ILandExplorerGameState, eState: IEventState): ILandExplorerGameState {
    return {...state,
        landState: StateCopyToControls(state.landState, eState)
    };
}

export function Display(ctx: DrawContext, state: ILandExplorerGameState): void {
    ctx.clear();
    // objects not affected by movement. e.g GUI
    DisplayTitle(ctx, state.landState.title);
    DisplayView(ctx, state.view, state.landState.ship.x, state.landState.ship.y, state.landState, {displayState: DisplayLandExplorer});
    DrawText(ctx, 20, AsteroidAssets.assets.height-5, "x: " + Math.round(state.landState.ship.x));
    DrawText(ctx, 60, AsteroidAssets.assets.height-5, "y: " + Math.round(state.landState.ship.y)) ;
    if (state.landState.ship.landed) {
        DrawText(ctx, 20, AsteroidAssets.assets.height-20, "Landed");
    }
    if (!TestFlat(PopSurfaceBuffer(state.landState.surface), state.landState.ship.x)) {
        DrawText(ctx, 20, AsteroidAssets.assets.height-35, "Warning: Not Flat");
    }
    if (!TestLandingSpeed(state.landState.ship)) {
        DrawText(ctx, 20, AsteroidAssets.assets.height-50, "Warning: Too Fast");
    }
    if (!VerticallyAligned(state.landState.ship.angle)) {
        DrawText(ctx, 20, AsteroidAssets.assets.height-65, "Warning: Not Aligned");
    }
}
