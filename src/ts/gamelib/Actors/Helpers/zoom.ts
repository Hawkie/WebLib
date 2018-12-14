export function centreZoom_old(h: number, y:number): number {
    return  h/2/(h-Math.min(y, (3*h/4)));
}

export function centreZoom(h: number, y:number, maxZoom:number = 2): number {
    return 1/Math.max(1/maxZoom, 2 - 2 * y/h);
}