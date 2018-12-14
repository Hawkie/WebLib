
import { DrawContext } from "../1Common/DrawContext";

export class Canvas {
    readonly canvas : HTMLCanvasElement;
    readonly ctx : any;
    readonly c : DrawContext;
    constructor(width : number, height : number, document : Document) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas";
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.c = new DrawContext(this.ctx);
        document.getElementById("div2").appendChild(this.canvas);
    }

    public context(): DrawContext {
        return this.c;
    }
}