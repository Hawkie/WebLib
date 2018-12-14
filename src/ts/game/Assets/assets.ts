import { IImageElement, ImageElement } from "../../gamelib/Elements/ImageElement";
import { IAudioElement, AudioElement } from "../../gamelib/Elements/AudioElement";
import { Game } from "../../gamelib/1Common/Game";

export class Assets {

    // graphics
    public terrain: IImageElement = new ImageElement("res/img/terrain.png");
    public grass: IImageElement = new ImageElement("res/img/grass25.png");
    public airBalloon: IImageElement = new ImageElement("res/img/airBalloon.png");
    public fallingMan: IImageElement = new ImageElement("res/img/fallingman.png");
    // buttons
    public backButton: IImageElement = new ImageElement("res/img/backButtonThumb.png");
    public nextButton: IImageElement = new ImageElement("res/img/nextButtonThumb.png");
    public surprise: IImageElement = new ImageElement("res/img/surprise.png");

    // sounds
    // music
    public flyInspire: IAudioElement = new AudioElement("res/sound/flyInspire.mp3", true);
    public cinematic: IAudioElement = new AudioElement("res/sound/cinematic.mp3", true);
    public emotional: IAudioElement = new AudioElement("res/sound/emotional.mp3", true);
    // sound fx
    public glassPing: IAudioElement = new AudioElement("res/sound/glassPing.mp3");
    public thrust: IAudioElement = new AudioElement("res/sound/thrust.mp3");
    public explosion: IAudioElement = new AudioElement("res/sound/explosion.mp3");
    public scream: IAudioElement = new AudioElement("res/sound/scream.mp3");
    public splat: IAudioElement = new AudioElement("res/sound/splat.mp3");

    public aCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();

    public gMap:Map<string, IImageElement> = new Map<string,IImageElement>();

    public readonly width:number = 480;
    public readonly height:number = 512;
}

let init: boolean = false;

export function safariAudio(): void {
    let log:string = "";
    let initialised: boolean = false;
    if (!init) {
        if (Game.assets.aCtx.state === "suspended") {
            Game.assets.aCtx.resume();
            log = "Suspended Audio Resumed";
        } else {
            log = "Audio not suspended";
        }
        console.log(log);
        initialised = Game.assets.flyInspire.init();
        initialised = initialised && Game.assets.emotional.init();
        initialised = initialised && Game.assets.cinematic.init();
        initialised = initialised && Game.assets.explosion.init();
        initialised = initialised && Game.assets.glassPing.init();
        initialised = initialised && Game.assets.thrust.init();
        initialised = initialised && Game.assets.splat.init();
        initialised = initialised && Game.assets.scream.init();
        init = initialised;
        console.log("Safari sound initialised: " + init);
    }
}