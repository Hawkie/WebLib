import { Canvas } from "../../gamelib/Elements/Canvas";
import { Game } from "../../gamelib/1Common/Game";

export interface IPage {
    create(): void;
}

export function CreateAirRiderHtml(document: Document): Canvas {
    let canvas: Canvas = new Canvas(Game.assets.width, Game.assets.height, document);
    return canvas;
}