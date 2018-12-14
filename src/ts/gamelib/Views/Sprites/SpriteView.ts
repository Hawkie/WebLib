import { DrawContext } from "../DrawContext";
import { ISprite, SpriteFrame } from "../../../gamelib/DataTypes/Sprite";
import { IImageElement } from "../../Elements/ImageElement";

export function DrawSprite(ctx: DrawContext, x: number, y: number, sprite: ISprite, spriteImg: IImageElement): void {
    const frame: SpriteFrame = sprite.frames[sprite.index];
    ctx.drawSprite(spriteImg.img,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        x, y,
        frame.width * sprite.scaleX,
        frame.height * sprite.scaleY);
}


