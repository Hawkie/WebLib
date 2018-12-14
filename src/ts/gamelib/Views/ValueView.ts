import { DrawContext } from "./DrawContext";

export function DrawNumber(ctx: DrawContext, x: number, y: number, n: number, font: string = "Arial", fontSize: number =  10): void {
    ctx.drawText(x, y, n.toFixed(1), fontSize, font);
}