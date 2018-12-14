import { DrawContext } from "../../../ts/gamelib/1Common/DrawContext";
import { IImageElement } from "../Elements/ImageElement";

export function DrawGraphic(ctx: DrawContext, x:number, y: number, graphic: IImageElement): void {
    if (graphic.loaded) {
        ctx.drawImage(graphic.img, x, y);
    }
}

export function DrawGraphicAngled(ctx: DrawContext, x:number, y: number, angle: number, graphic: IImageElement): void {
    if (graphic.loaded) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        if (graphic.loaded) {
            ctx.drawImage(graphic.img, x, y);
        }
        ctx.restore();
    }
}
