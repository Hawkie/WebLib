import { Game } from "../gamelib/1Common/Game";
import { IStateProcessor } from "../gamelib/State/StateProcessor";
import { IState, createStateMachineProcessor } from "../gamelib/State/StateMachine";
import { CreateState } from "../game-air-rider/States/CreateStateMachine";
import { Canvas } from "../gamelib/Elements/Canvas";
import { CreateAirRiderHtml } from "../game-air-rider/Html/CreateHtml";
import { CreateAirRiderAssets } from "./Assets/assets";

// create state here and pass to game
const state: IState = CreateState();
let fsm: IStateProcessor<IState> = createStateMachineProcessor();
const canvas: Canvas = CreateAirRiderHtml(document);

let game: Game<IState> = new Game();
game.run(window, document, canvas, state, fsm, CreateAirRiderAssets());

