import { CreateButton } from "../gamelib/Elements/Button";
import { Canvas } from "../gamelib/Elements/Canvas";
import { Assets } from "./assets";

export function CreateTestHtml(document: Document): Canvas {
    let b1:HTMLButtonElement = document.getElementById("div1").appendChild(CreateButton(document, "Play mp3"));
    b1.onclick = (e => {Assets.assets.cinematic.play();});
    let b2:HTMLButtonElement = document.getElementById("div1").appendChild(CreateButton(document, "Play wav"));
    b2.onclick = (e => {Assets.assets.explosion.play();});
    return new Canvas(Assets.assets.width, Assets.assets.height, document);
}