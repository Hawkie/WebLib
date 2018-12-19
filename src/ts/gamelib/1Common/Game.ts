import { EventLoop } from "./EventLoop";
import { IStateProcessor } from "../State/StateProcessor";
import { Canvas } from "../Elements/Canvas";
import { IAssets } from "../../../../examples/game-air-rider/src/ts/Assets/assets";

export class Game<TState> {


    // globals are doc and window
    run(window: Window, document: Document, canvas: Canvas, state: TState, fsm: IStateProcessor<TState>, assets: IAssets): void {
        console.log("Game Run()");

        // let audioContext: AudioContext = new AudioContext();
        let gameloop: EventLoop<TState> = new EventLoop(document, window, canvas, state, fsm, assets);
        gameloop.loop();
    }
}