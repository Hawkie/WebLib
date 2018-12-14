import { Canvas } from "../../gamelib/Elements/Canvas";
import { Game } from "../../gamelib/1Common/Game";
import { Assets } from "../Assets/assets";

export interface IPage {
    create(): void;
}

export function CreateAirRiderHtml(document: Document): Canvas {
    let canvas: Canvas = new Canvas(Assets.assets.width, Assets.assets.height, document);
    return canvas;
}