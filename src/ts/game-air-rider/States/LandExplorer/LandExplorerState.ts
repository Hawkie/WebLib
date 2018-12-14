import { IShip, CrashShip, DisplayShip, ShipCopyToUpdated,
    ShipSounds, LandShip, ShipCopyToStopBullet } from "../../Components/Ship/ShipComponent";
import { ISurface, DisplaySurface, addSurface, TestFlat } from "../../Components/SurfaceComponent";
import { IParticleField } from "../../Components/FieldComponent";
import { IControls, InputControls, CreateControls } from "../../Components/ControlsComponent";
import { IEventState, CreateEventState, Click } from "../../../gamelib/Events/EventProcessor";
import { DrawContext } from "../../../gamelib/Views/DrawContext";
import { DisplayField, FieldGenMove, IParticle } from "../../../gamelib/Components/ParticleFieldComponent";
import { Transforms } from "../../../gamelib/Physics/Transforms";
import { IShapedLocation, ShapeCollisionDetector } from "../../../gamelib/Interactors/ShapeCollisionDetector";
import { ISplat, CreateSplat, DisplaySplat, UpdateSplat, ResetSplat } from "../../Components/SplatComponent";
import { DrawLine } from "../../../gamelib/Views/LineView";
import { Assets } from "../../Assets/assets";

export interface ILandExplorerState {
    readonly title: string;
    readonly controls: IControls;
    readonly ship: IShip;
    readonly starField: IParticleField;
    readonly surface: ISurface;
    readonly score: number;
    readonly residualScore: number;
    readonly splat: ISplat;
    readonly splatIndex: number;
    readonly splatSound: boolean;
    readonly events: IEventState;
}

export function CreateLandExplorer(ship: IShip, starfield: IParticleField, surface: ISurface,
     residualScore: number = 0): ILandExplorerState {
    return {
        title: "Air Rider",
        controls: CreateControls(),
        ship: ship,
        starField: starfield,
        surface: surface,
        score: 0,
        splat: CreateSplat(),
        splatIndex: -1,
        splatSound: false,
        residualScore: residualScore,
        events: CreateEventState(),
    };
}

export function DisplayLandExplorer(ctx: DrawContext, state: ILandExplorerState): void {
    DisplayShip(ctx, state.ship);
    DisplayField(ctx, state.starField.particles);
    DisplaySurface(ctx, state.surface);
    DisplaySplat(ctx, state.splat);
    // draw drag line
    if (state.events.start !== undefined && state.events.current !== undefined && state.events.press) {
        DrawLine(ctx, state.ship.x, state.ship.y,
            state.ship.x + state.events.current.x - state.events.start.x,
            state.ship.y + state.events.current.y - state.events.start.y);
    }
}

export function LandExplorerSounds(state: ILandExplorerState): ILandExplorerState {
    ShipSounds(state.ship);
    if (state.splatSound) {
        Assets.assets.splat.replay();
    }
    // turn off any sound triggers - need to think about this
    return state;
}


export function StateCopyToUpdate(state: ILandExplorerState, timeModifier: number): ILandExplorerState {
    // distance(px)/100 * passengers/8
    let score: number = state.residualScore + ((state.ship.x - Assets.assets.width/2) / 50) * state.ship.weapon1.remaining/8;
    let splat: ISplat = state.splat;
    if (state.splatIndex > -1) {
        const passenger: IParticle = state.ship.weapon1.bullets[state.splatIndex];
        splat = UpdateSplat(timeModifier, state.splat, true, passenger.x, passenger.y);
    }

    return {...state,
        ship: ShipCopyToUpdated(timeModifier, state.ship, state.controls),
        starField: FieldGenMove(timeModifier, state.starField, true, 2, (now: number) => {
            return {
                x: 0,
                y: Transforms.random(0, Assets.assets.height),
                Vx: Transforms.random(10, 30),
                Vy: 0,
                born: now,
                size: 1,
            };
        }),
        surface: addSurface(state.surface, state.ship.x, state.ship.y, Assets.assets.width, state.surface.surfaceGenerator),
        score: score,
        splat: splat,
    };
}

export function InputState(state: ILandExplorerState, eState: IEventState): ILandExplorerState {
    let newEventState: IEventState = Click(state.events, eState);
    return {...state,
        controls: InputControls(newEventState),
        events: newEventState,
    };
}

export function Tests(state: ILandExplorerState): ILandExplorerState {
    let newState:ILandExplorerState = ManHitsLand(state);
    return TouchLand(newState);
}

function TouchLand(state: ILandExplorerState): ILandExplorerState {
    if (Transforms.hasPoint(state.surface.points.map(p => p), { x: 0, y: -5 }, state.ship)) {
        // check velocity
        if (!state.ship.crashed && TestLand(state)) {
            return {...state,
                ship: LandShip(state.ship)
            };
        } else {
            return {...state,
                ship: CrashShip(state.ship, 0, 0),
                score: 0,
            };
        }
    }
    return state;
}

function TestLand(state: ILandExplorerState): boolean {
    // check touch down
    if (state.ship.Vy < 10) {
        // check flat bit of land
        return TestFlat(state.surface, state.ship.x);
    }
    console.log("Too fast: " + state.ship.Vy);
    return false;
}


function ManHitsLand(state: ILandExplorerState): ILandExplorerState {
    const surfaceShape: IShapedLocation = {
        location: {x: 0, y: 0},
        shape: {
            offset: {x: 0, y: 0},
            points: state.surface.points,
        }
    };
    const indexPassenger: number = ShapeCollisionDetector(surfaceShape,
        state.ship.weapon1.bullets.slice(state.splatIndex+1).map(b => { return {
                x: b.x,
                y: b.y,
            };
        }));
    const realIndex: number = indexPassenger + 1 + state.splatIndex;
    if (realIndex > state.splatIndex) {
        console.log("How could you?! " + indexPassenger + " " + state.splatIndex);
        return {...state,
            splatIndex: realIndex,
            splatSound: true,
            splat: ResetSplat(state.splat),
            // stop passenger
            ship: ShipCopyToStopBullet(state.ship, realIndex),
        };
    }
    return {...state,
        splatSound: false
    };
}