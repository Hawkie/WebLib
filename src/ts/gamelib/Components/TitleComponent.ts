import { DrawContext } from "../Views/DrawContext";
import { DrawText } from "../Views/TextView";

// map title to text view
export function DisplayTitle(ctx: DrawContext, title: string, fontSize: number = 18): void {
    DrawText(ctx, ctx.width/2 - title.length*fontSize/3, 20, title, "Arial", fontSize);
}


export function DisplayText(ctx: DrawContext, title: string, x: number, y: number, fontSize: number = 10): void {
    DrawText(ctx, x, y, title, "Arial", fontSize);
}