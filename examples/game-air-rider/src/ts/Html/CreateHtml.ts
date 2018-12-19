import { Canvas } from "../../../../../src/ts/gamelib/Elements/Canvas";
import { Assets } from "../Assets/assets";

export interface IPage {
    create(): void;
}

export function CreateAirRiderHtml(document: Document): Canvas {
    let canvas: Canvas = new Canvas(Assets.assets.width, Assets.assets.height, document);
    return canvas;
}