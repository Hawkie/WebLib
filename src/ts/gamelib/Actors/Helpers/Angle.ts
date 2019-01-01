export function VerticallyAligned(th: number): boolean {
    const a: number = th / 180 * Math.PI;
    // test if angle is near zero. sin 0 = 0, sin 180 = 0
    if (Math.abs(Math.sin(a)) < 0.1) {
        // test if ship pointing up not down
        if (Math.cos(a) > 0) {
            return true;
        }
    }
    return false;
}
