import { Assets } from "../../game/Assets/assets";
import { EventLoop } from "./EventLoop";
import { IStateProcessor } from "../State/StateProcessor";
import { Canvas } from "../Elements/Canvas";


export class Game<TState> {

    private static _assets: Assets = new Assets();
    public static get assets(): Assets { return this._assets; }

    // globals are doc and window
    run(window: Window, document: Document, canvas: Canvas, state: TState, fsm: IStateProcessor<TState>): void {
        console.log("Game Run()");

        // let audioContext: AudioContext = new AudioContext();
        let gameloop: EventLoop<TState> = new EventLoop(document, window, canvas, state, fsm);
        gameloop.loop();
    }
}