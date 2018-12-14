
import { DrawContext } from "../Views/DrawContext";

export class Canvas {
    readonly canvas : HTMLCanvasElement;
    readonly ctx : any;
    readonly c : DrawContext;
    constructor(readonly width : number, readonly height : number, document : Document) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas";
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.c = new DrawContext(this.ctx, width, height);
        document.getElementById("div2").appendChild(this.canvas);
    }

    public context(): DrawContext {
        return this.c;
    }
}