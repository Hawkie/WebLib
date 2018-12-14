import { Game } from "./gamelib/1Common/Game";
import { IStateProcessor } from "./gamelib/State/StateProcessor";
import { IState, createStateMachineProcessor } from "./gamelib/State/StateMachine";
import { CreateState } from "./game/States/CreateStateMachine";
import { CreateTestStateMachine, ITestState, CreateTestState } from "./game-test/CreateTestStateMachine";
import { CreateTestHtml } from "./game-test/CreateHtml";
import { Canvas } from "./gamelib/Elements/Canvas";
import { CreateAirRiderHtml } from "./game/Html/CreateHtml";

// create state here and pass to game
const state: IState = CreateState();
let fsm: IStateProcessor<IState> = createStateMachineProcessor();
const canvas: Canvas = CreateAirRiderHtml(document);

let game: Game<IState> = new Game();
game.run(window, document, canvas, state, fsm);

// const testState: ITestState = CreateTestState();
// let testFsm: IStateProcessor<ITestState> = CreateTestStateMachine();
// const canvas: Canvas = CreateTestHtml(document);

// let game: Game<ITestState> = new Game();
// game.run(window, document, canvas, testState, testFsm);
