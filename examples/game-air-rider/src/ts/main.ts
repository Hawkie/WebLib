import { Game } from "../../../../src/ts/gamelib/1Common/Game";
import { IStateProcessor } from "../../../../src/ts/gamelib/State/StateProcessor";
import { IState, createStateMachineProcessor } from "../../../../src/ts/gamelib/State/StateMachine";
import { CreateState } from "./States/CreateStateMachine";
import { Canvas } from "../../../../src/ts/gamelib/Elements/Canvas";
import { CreateAirRiderHtml } from "./Html/CreateHtml";
import { CreateAirRiderAssets } from "./Assets/assets";

// create state here and pass to game
const state: IState = CreateState();
let fsm: IStateProcessor<IState> = createStateMachineProcessor();
const canvas: Canvas = CreateAirRiderHtml(document);

let game: Game<IState> = new Game();
game.run(window, document, canvas, state, fsm, CreateAirRiderAssets());

