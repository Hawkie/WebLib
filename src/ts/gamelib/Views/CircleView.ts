import { DrawContext } from "./DrawContext";

export function DrawCircle(drawContext: DrawContext, x: number, y: number, r: number): void {
    drawContext.drawCircle(x, y, r);
}