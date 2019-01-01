import { VerticallyAligned } from "./Angle";

test("right", () => {
    const a: number = 90;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(false);
});

test("left", () => {
    const a: number = -90;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(false);
});

test("down", () => {
    const a: number = 180;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(false);
});

test("upright", () => {
    const a: number = 0;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(true);
});

test("upright neg tolerance", () => {
    const a: number = -0.1;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(true);
});

test("upright pos tolerance", () => {
    const a: number = 0.1;
    const result: boolean = VerticallyAligned(a);
    expect(result).toBe(true);
});
