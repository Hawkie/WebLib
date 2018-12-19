import { IImageElement, ImageElement } from "../../../../src/ts/gamelib/Elements/ImageElement";
import { IAudioElement, AudioElement } from "../../../../src/ts/gamelib/Elements/AudioElement";


export interface IAssets {
    safariAudio(): void;
}

export function CreateTestAssets(): IAssets {
    return {
        safariAudio: SafariAudio,
    };
}

export class Assets {

    // images
    // buttons
    public backButton: IImageElement = new ImageElement("res/img/backButtonThumb.png");
    public nextButton: IImageElement = new ImageElement("res/img/nextButtonThumb.png");
    public redBall: IImageElement = new ImageElement("res/img/redBall.png");


    // sounds
    // music
    public cinematic: IAudioElement = new AudioElement("res/sound/cinematic.mp3", true);
    // sound fx
    public explosion: IAudioElement = new AudioElement("res/sound/explosion.mp3");


    public aCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();

    public readonly width:number = 480;
    public readonly height:number = 512;

    public static assets: Assets = new Assets();
}

let init: boolean = false;
export function SafariAudio(): void {
    let log:string = "";
    let initialised: boolean = false;
    if (!init) {
        if (Assets.assets.aCtx.state === "suspended") {
            Assets.assets.aCtx.resume();
            log = "Suspended Audio Resumed";
        } else {
            log = "Audio not suspended";
        }
        console.log(log);
        initialised = Assets.assets.cinematic.init();
        initialised = initialised && Assets.assets.explosion.init();
        init = initialised;
        console.log("Safari sound initialised: " + init);
    }
}