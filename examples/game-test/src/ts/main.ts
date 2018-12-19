import { Game } from "../../../../src/ts/gamelib/1Common/Game";
import { IStateProcessor } from "../../../../src/ts/gamelib/State/StateProcessor";
import { CreateTestStateMachine, ITestState, CreateTestState } from "./CreateTestStateMachine";
import { CreateTestHtml } from "./CreateHtml";
import { Canvas } from "../../../../src/ts/gamelib/Elements/Canvas";
import { CreateTestAssets } from "./assets";


// create state here and pass to game
const testState: ITestState = CreateTestState();
let testFsm: IStateProcessor<ITestState> = CreateTestStateMachine();
const canvas: Canvas = CreateTestHtml(document);

let game: Game<ITestState> = new Game();
game.run(window, document, canvas, testState, testFsm, CreateTestAssets());
