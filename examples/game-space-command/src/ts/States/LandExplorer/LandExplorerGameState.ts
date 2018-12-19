﻿import { ILandExplorerState, CreateLandExplorer, StateCopyToUpdate,
    TestPlayerHit, LandExplorerSounds, StateCopyToControls, DisplayLandExplorer } from "./LandExplorerState";
import { IView, CreateView, Zoom, DisplayView } from "../../Components/ViewPortComponent";
import { ISurfaceGeneration, initSurface, ISurface } from "../../Components/SurfaceComponent";
import { IShip, CreateShip } from "../../Components/Ship/ShipComponent";
import { AsteroidAssets } from "../../Assets/assets";
import { MoveShip } from "../../Components/Ship/MovementComponent";
import { ICoordinate } from "../../../../../../src/ts/gamelib/DataTypes/Coordinate";
import { DrawContext } from "../../../../../../src/ts/gamelib/Views/DrawContext";
import { DisplayTitle } from "../../../../../../src/ts/gamelib/Components/TitleComponent";
import { IEventState } from "../../../../../../src/ts/gamelib/Events/EventProcessor";
import { IParticleField, CreateField } from "../../Components/FieldComponent";

export interface ILandExplorerGameState {
    landState: ILandExplorerState;
    view: IView;
}

export function CreateGameStateLandExplorer(): ILandExplorerGameState {
    let surfaceGenerator: ISurfaceGeneration = {
        resolution: 5,
        upper: 5,
        lower: -5,
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



        // scene objects
        // this.landingPad = LandExplorerState.createLandingPadObject(this.surface);
        // this.ballObject = LandExplorerState.createBallObject(this.surface);
        // this.sceneObjects.push(this.surface, this.landingPad, this.ballObject,

        // gui Objects
        // this.velocityText = new TextObject("", new Coordinate(325, 50), "monospace", 12);
        // this.wind = LandExplorerState.createWindDirectionIndicator(new Coordinate(450, 50));
        // this.guiObjects.push(this.velocityText, this.wind, this.player.explosionController.screenFlash);

        // let shipLandingPadDetector: IInteractor = new ObjectCollisionDetector(this.landingPad.model,
        // this.player.chassisObj.model.physics, this.playerLandingPadCollision.bind(this));
        // let windEffect: IInteractor = new Interactor(this.wind.model, this.player, this.windEffectCallback);
        // shipLandingPadDetector, windEffect];


    // windEffectCallback(lastTestModifier: number, wind: WindModel, controller: SpaceShipController) {
    //     controller.chassisObj.model.physics.velX += wind.physics.value * lastTestModifier;
    // }

    // playerLandingPadCollision() {
    //     if (this.player.chassisObj.model.physics.velY > 0) {
    //         console.log("Land velocity: " + this.player.chassisObj.model.physics.velY);

    //         if (this.player.chassisObj.model.physics.velY > 20) {
    //             this.player.crash();
    //         }

    //         this.player.chassisObj.model.physics.velY = 0;
    //         this.player.chassisObj.model.physics.velX = 0;
    //     }
    // }

    // static createLandingPadObject(surface: SingleGameObject): void {
    //     let placeIndex = Transforms.random(0, 50);
    //     let xy = surface.model.shape.points[placeIndex];
    //     let padModel = new LandingPadModel(new Coordinate(xy.x + surface.model.physics.location.x,
    //         xy.y + surface.model.physics.location.y));
    //     let padView: IView = new PolyView(() => { return {
    //         x: padModel.physics.location.x,
    //         y: padModel.physics.location.y,
    //         shape: padModel.shape,
    //     };});
    //     let obj = new SingleGameObject(padModel, [], [padView]);
    //     return obj;
    // }

    // static createBallObject(surface: SingleGameObject) {
    //     let placeIndex = Transforms.random(0, 50);
    //     let xy = surface.model.shape.points[placeIndex];
    //     let ballModel: IBallObject = {
    //         x: xy.x + surface.model.physics.location.x,
    //         y: xy.y + surface.model.physics.location.y-8,
    //         vx: 0,
    //         vy: 0,
    //         r: 8,
    //         mass: 1,
    //     };
    //     let ballView: IView = new CircleView(() => {
    //         return {
    //             x: ballModel.x,
    //             y: ballModel.y,
    //             r: ballModel.r,
    //         };
    //     });
    //     // not needed at this stage
    //     let mover: MoveConstVelocity = new MoveConstVelocity(
    //         ()=> {
    //             return {
    //                 vx: ballModel.Vx,
    //                 vy: ballModel.Vy,
    //             };
    //         }, (mOut: IMoveOut)=> {
    //             ballModel.x += mOut.dx;
    //             ballModel.y += mOut.dy;
    //         });
    //     let obj = new SingleGameObject(ballModel, [mover], [ballView]);
    //     return obj;
    // }

    // static createWindDirectionIndicator(location: Coordinate): SingleGameObject {
    //     let model: WindModel = new WindModel(location);
    //     let windGenerator: IActor = new WindGenerator(model.physics, model.shape);
    //     let viewArrow: IView = new PolyView(() => { return {
    //         x: model.physics.location.x,
    //         y: model.physics.location.y,
    //         shape: model.shape,
    //     };});
    //     let viewText: IView = new ValueView(model.physics, "{0} mph", "monospace", 12);
    //     let obj = new SingleGameObject(model, [windGenerator], [viewArrow, viewText]);
    //     return obj;
    // }

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
}