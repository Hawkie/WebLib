import { Game } from "../gamelib/1Common/Game";
import { IStateProcessor } from "../gamelib/State/StateProcessor";
import { CreateTestStateMachine, ITestState, CreateTestState } from "../game-test/CreateTestStateMachine";
import { CreateTestHtml } from "../game-test/CreateHtml";
import { Canvas } from "../gamelib/Elements/Canvas";
import { CreateTestAssets } from "./assets";


// create state here and pass to game
const testState: ITestState = CreateTestState();
let testFsm: IStateProcessor<ITestState> = CreateTestStateMachine();
const canvas: Canvas = CreateTestHtml(document);

let game: Game<ITestState> = new Game();
game.run(window, document, canvas, testState, testFsm, CreateTestAssets());
