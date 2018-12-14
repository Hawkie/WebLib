import { Game } from "../gamelib/1Common/Game";
import { CreateButton } from "../gamelib/Elements/Button";
import { Canvas } from "../gamelib/Elements/Canvas";

export function CreateTestHtml(document: Document): Canvas {
    let b1:HTMLButtonElement = document.getElementById("div1").appendChild(CreateButton(document, "Play mp3"));
    b1.onclick = (e => {Game.assets.cinematic.play();});
    let b2:HTMLButtonElement = document.getElementById("div1").appendChild(CreateButton(document, "Play wav"));
    b2.onclick = (e => {Game.assets.explosion.play();});
    return new Canvas(Game.assets.width, Game.assets.height, document);
}