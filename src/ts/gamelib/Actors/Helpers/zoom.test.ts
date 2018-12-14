import { centreZoom } from "./zoom";

const SCREEN_SIZE: number = 480;


describe.each([[480, 2], [240, 1], [0, 0.5], [-240, 0.33], [-480, 0.25]])(
    ".with(%d %d)",
    (y, r) => {

    test("Limit testing", () => {
        const result: number = centreZoom(SCREEN_SIZE, y);
        expect(result).toBeCloseTo(r);
    });
});

describe.each([[-4800, 0.045], [481, 2], [1000, 2]])(
    ".with(%d %d)",
    (y, r) => {

    test("Beyond Limit testing", () => {
        const result: number = centreZoom(SCREEN_SIZE, y);
        expect(result).toBeCloseTo(r);
    });
});

const SCREEN_SIZE2: number = 960;

describe.each([[960, 2], [480, 1], [0, 0.5], [-480, 0.33], [-960, 0.25]])(
    ".with(%d %d)",
    (y, r) => {

    test("Limit testing", () => {
        const result: number = centreZoom(SCREEN_SIZE2, y);
        expect(result).toBeCloseTo(r);
    });
});

describe.each([[-9600, 0.045], [960, 2], [1000, 2]])(
    ".with(%d %d)",
    (y, r) => {

    test("Beyond Limit testing", () => {
        const result: number = centreZoom(SCREEN_SIZE2, y);
        expect(result).toBeCloseTo(r);
    });
});

