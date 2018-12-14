import { DrawContext} from "../../../gamelib/Views/DrawContext";
import { EventProcessor, IEventState } from "../../../gamelib/Events/EventProcessor";
import { CreateLandExplorer, ILandExplorerState,
    StateCopyToUpdate, DisplayLandExplorer, LandExplorerSounds, Tests, InputState } from "./LandExplorerState";
import { CreateShip, IShip, DisplayShip } from "../../Components/Ship/ShipComponent";
import { ICoordinate } from "../../../gamelib/DataTypes/Coordinate";
import { initSurface, ISurface, ISurfaceGeneration, TestFlat } from "../../Components/SurfaceComponent";
import { IParticleField, CreateField } from "../../Components/FieldComponent";
import { DisplayTitle } from "../../../gamelib/Components/TitleComponent";
import { MoveShip } from "../../Components/Ship/MovementComponent";
import { CreateView, IView, DisplayView, Zoom } from "../../Components/ViewPortComponent";
import { Game } from "../../../gamelib/1Common/Game";
import { DrawNumber } from "../../../gamelib/Views/ValueView";
import { DrawText } from "../../../gamelib/Views/TextView";
import { DrawGraphic } from "../../../gamelib/Views/GraphicView";
import { Assets } from "../../Assets/assets";

export interface ILandExplorerGameState {
    landState: ILandExplorerState;
    view: IView;
}

export function CreateGameStateLandExplorer(score: number): ILandExplorerGameState {
    let surfaceGenerator: ISurfaceGeneration = {
        resolution: 10,
        upper: 10,
        lower: -10,
        flatChance: 0.5,
    };
    let ship: IShip = CreateShip(Assets.assets.width/2, Assets.assets.height/2, 10,
        MoveShip);
    let points: ICoordinate[] = initSurface(Assets.assets.width, surfaceGenerator);
    let surface: ISurface = {
        addedLeft: 0,
        points: points,
        surfaceGenerator: surfaceGenerator,
    };
    let starfield: IParticleField = CreateField(true, 1, 1);
    let state: ILandExplorerState = CreateLandExplorer(ship, starfield, surface, score);
    let view: IView = CreateView(true);
    return {
        landState: state,
        view: view,
    };
}

export function Update(state: ILandExplorerGameState, timeModifier: number): ILandExplorerGameState {
    let newState: ILandExplorerState = state.landState;
    if (newState.controls.next) {
        if (newState.ship.landed || newState.ship.crashed) {
            return CreateGameStateLandExplorer(newState.score);
        }
    }
    // combine our three state changes from one update function
    newState = StateCopyToUpdate(newState, timeModifier);
    newState = Tests(newState);
    return {...state,
        landState: newState,
        view: Zoom(state.view, newState.controls.zoomIn, newState.controls.zoomOut, newState.ship.y)
    };
}

export function Sounds(state: ILandExplorerGameState): ILandExplorerGameState {
    let newLandState: ILandExplorerState = LandExplorerSounds(state.landState);
    if (newLandState.controls.next) {
        if (newLandState.ship.landed || newLandState.ship.crashed) {
            Assets.assets.explosion.reset();
            Assets.assets.flyInspire.reset();
            Assets.assets.cinematic.reset();
            Assets.assets.emotional.reset();
        }
    } else if (newLandState.controls.exit) {
        Assets.assets.flyInspire.pause();
        Assets.assets.cinematic.pause();
        Assets.assets.emotional.pause();
    } else if (newLandState.ship.crashed) {
        Assets.assets.emotional.play();
        Assets.assets.flyInspire.pause();
        Assets.assets.cinematic.pause();
    } else if (newLandState.ship.landed) {
        Assets.assets.flyInspire.pause();
        Assets.assets.cinematic.play();
    } else {
        Assets.assets.flyInspire.play();
        Assets.assets.cinematic.pause();
        Assets.assets.emotional.pause();
    }
    return {...state,
        landState: newLandState
    };
}

export function InputGameState(state: ILandExplorerGameState, eState: IEventState): ILandExplorerGameState {
    let newState: ILandExplorerState = InputState(state.landState, eState);
    return {...state,
        landState: newState,
    };
}

export function Display(ctx: DrawContext, state: ILandExplorerGameState): void {
    ctx.clear();
    // objects not affected by movement. e.g GUI
    DisplayView(ctx, state.view, state.landState.ship.x, 512-(512+123-state.landState.ship.y)/2,
     state.landState, {displayState: DisplayLandExplorer});
    DisplayGUI(ctx, state);
}

function DisplayGUI(ctx: DrawContext, state: ILandExplorerGameState): void {
    // back button
    ctx.zoom(0.5, 0.5);
    DrawGraphic(ctx, 0, 0, Assets.assets.backButton);
    DrawGraphic(ctx, Assets.assets.width-50, Assets.assets.height*2-100, Assets.assets.surprise);
    ctx.zoom(2, 2);

    // next button
    if (state.landState.ship.crashed || state.landState.ship.landed) {
        ctx.zoom(0.5, 0.5);
        DrawGraphic(ctx, 0, Assets.assets.height*2-100, Assets.assets.nextButton);
        ctx.zoom(2, 2);
    }
    DisplayTitle(ctx, state.landState.title);
    let y:number = 20;
    const x: number = 40;
    const x2: number = 100;

    // if (state.landState.events.start !== undefined && state.landState.events.current !== undefined) {
    // //    DrawNumber(ctx, 10, 10, state.landState.events.start.x);
    // //    DrawNumber(ctx, 10, 30, state.landState.events.current.x);
    // }
    // score
    DrawText(ctx, Assets.assets.width - x2, y, "Prestige:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.score);
    // distance
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Distance:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.x - (Assets.assets.width/2));
    // passengers
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Passengers:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.weapon1.remaining);
    // fuel
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Fuel:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.fuel);
    // fuel
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Temp:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.temp);
    // mass
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Mass:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.mass);
    // decent speed
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Descent:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.guiDescent);
    // air Speed
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Air Speed:");
    DrawNumber(ctx, Assets.assets.width- x, y, state.landState.ship.Vx);
    // height
    y +=20;
    DrawText(ctx, Assets.assets.width - x2, y, "Height:");
    DrawNumber(ctx, Assets.assets.width- x, y, Math.abs(Assets.assets.height - state.landState.ship.y));

    const finalY:number = 400;
    // add landing warnings
    if (state.landState.ship.fuel < 100) {
        DrawText(ctx, Assets.assets.width/2 - 10, finalY + 12, "Low fuel", "Arial", 12);
    }

    if (state.landState.ship.y > 0) {
        if (state.landState.ship.guiDescent > 10) {
            DrawText(ctx, Assets.assets.width/2 - 10, finalY + 24, "Descending too fast", "Arial", 12);
        }
        if (!TestFlat(state.landState.surface, state.landState.ship.x)) {
            DrawText(ctx, Assets.assets.width/2 -10, finalY + 36, "Land not flat under balloon", "Arial", 12);
        }
    }

    if (state.landState.ship.landed) {
        DrawText(ctx, Assets.assets.width/2 - 50, finalY, "LANDED!", "Arial", 24);
    }
    if (state.landState.ship.crashed) {
        DrawText(ctx, Assets.assets.width/2 - 60, finalY, "CRASHED!", "Arial", 24);
    }
    if (state.landState.ship.crashed || state.landState.ship.landed) {
        DrawText(ctx, Assets.assets.width/2 - 100, finalY - 48, "Press <N> to continue", "Arial", 12);
        DrawText(ctx, Assets.assets.width/2 - 100, finalY - 32, "Press <Esc> for menu", "Arial", 12);
    }
}
