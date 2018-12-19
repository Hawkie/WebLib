import { IAudioElement, AudioElement } from "../../../../../src/ts/gamelib/Elements/AudioElement";
import { IImageElement, ImageElement } from "../../../../../src/ts/gamelib/Elements/ImageElement";

export class AsteroidAssets {


    // graphics
    public terrain: IImageElement = new ImageElement("res/img/terrain.png");
    public coinSprite: IImageElement = new ImageElement("res/img/spinningCoin.png");
    public graphicShip: IImageElement = new ImageElement("res/img/ship.png");

    // sounds
    public timePortal: IAudioElement = new AudioElement("res/sound/TimePortal.mp3", true);
    public blast: IAudioElement = new AudioElement("res/sound/blast.wav");
    public thrust: IAudioElement = new AudioElement("res/sound/thrust.wav");
    public gun: IAudioElement = new AudioElement("res/sound/raygun-01.mp3");
    public explosion: IAudioElement = new AudioElement("res/sound/explosion.wav");


    public readonly width:number = 512;
    public readonly height:number = 480;

    public static assets: AsteroidAssets = new AsteroidAssets();
}