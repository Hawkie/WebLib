import { Canvas } from "../../../../../src/ts/gamelib/Elements/Canvas";
import { AsteroidAssets } from "../Assets/assets";

export function CreateHtml(document: Document): Canvas {
    return new Canvas(AsteroidAssets.assets.width, AsteroidAssets.assets.height, document);
}