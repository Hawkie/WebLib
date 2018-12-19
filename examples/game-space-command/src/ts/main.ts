import { Game } from "../../../../src/ts/gamelib/1Common/Game";
import { IStateProcessor } from "../../../../src/ts/gamelib/State/StateProcessor";
import { IState, createStateMachineProcessor } from "../../../../src/ts/gamelib/State/StateMachine";
import { CreateState } from "./States/CreateStateMachine";
import { Canvas } from "../../../../src/ts/gamelib/Elements/Canvas";
import { CreateHtml } from "./Html/CreateHtml";
import { IAssets } from "../../../game-test/src/ts/assets";


// tslint:disable-next-line:no-empty
const a: IAssets = { safariAudio: ()=> { } };

// create state here and pass to game
const state: IState = CreateState();
let fsm: IStateProcessor<IState> = createStateMachineProcessor();
const canvas: Canvas = CreateHtml(document);

let game: Game<IState> = new Game();
game.run(window, document, canvas, state, fsm, a);
