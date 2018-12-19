import { Game } from "../1Common/Game";

export function CreateButton(document: Document, label:string): HTMLButtonElement {
    let b: HTMLButtonElement = document.createElement("button");
    const t:Text = document.createTextNode(label);
    b.appendChild(t);
    return b;
}

export function CreateImgButton(document: Document, src:string): HTMLButtonElement {
    let b: HTMLButtonElement = document.createElement("button");
    const i:HTMLImageElement = document.createElement("img");
    i.src = src;
    b.appendChild(i);
    return b;
}

