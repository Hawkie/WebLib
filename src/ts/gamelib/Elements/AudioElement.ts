import { IEventState } from "../Events/EventProcessor";
import { Game } from "../1Common/Game";

export interface IAudioElement {
    init(): boolean;
    playOnce(): void;
    play(): void;
    replay(): void;
    pause(): void;
    reset(): boolean;
    playing: boolean;
    log: string;
    display(): string;
}

declare global {
// tslint:disable-next-line:interface-name
    interface Window {
        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
    }
}

export class AudioElement implements IAudioElement {
    private audioElement: HTMLAudioElement;
    private _playing: boolean = false;
    public log: string = "";
    private ready(): boolean { return this.audioElement.readyState === this.audioElement.HAVE_ENOUGH_DATA; }
    get playing(): boolean { return this._playing; }


    constructor(private source: string, private loop: boolean = false) {
        this.audioElement = new Audio();
        this.audioElement.oncanplaythrough = this.oncanplaythrough.bind(this);
        this.audioElement.src = this.source;
        this.audioElement.loop = this.loop;
        this.audioElement.load();
    }

    private oncanplaythrough(ev: Event): void {
        this.log += "canplay: " + this.source;
        console.log(this.log);
    }

    public display(): string {
        let d: string = this.audioElement.src;
        d+= " Log: " + this.log;
        d+= " Ready:" + this.audioElement.readyState.toString();
        if (this.audioElement.error !== null) {
            d += " Error: " + this.audioElement.error.code;
        }
        return d;
    // 1 = MEDIA_ERR_ABORTED - fetching process aborted by user
    // 2 = MEDIA_ERR_NETWORK - error occurred when downloading
    // 3 = MEDIA_ERR_DECODE - error occurred when decoding
    // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED - audio/video not supported
    }

    // call this multiple times and it will only play audio once when ready. (may repeat if loop is true)
    playOnce(): void {
        if (this.ready()) {
            if (!this.playing) {
                this._play();
            }
        }
    }

    init(): boolean {
        if (this.ready()) {
            this._playing = false;
            this.audioElement.play();
            this.audioElement.pause();
            return true;
        }
        return false;
    }

    reset(): boolean {
        if (this.ready()) {
            this._playing = false;
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            return true;
        }
        return false;
    }

    play(): void {
        if (this.ready()) {
            this._play();
        }
    }

    // each time this is called it will play audio from beginning
    replay(): void {
        if (this.ready()) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this._play();
        }
    }

    pause(): void {
        if (this.ready()) {
            this.audioElement.pause();
        }
    }

    private _play(): void {
        let p: Promise<void> = this.audioElement.play();
        if (p !== undefined) {
            p.then(r => {
                this._playing = true;
            });
            p.catch(e => {
                this.log += "play failed: " + e + this.source;
                console.log(this.log);
            });
        } else {
            this.log += "Promise undefined: " + this.source;
            console.log(this.log);
        }
    }
}