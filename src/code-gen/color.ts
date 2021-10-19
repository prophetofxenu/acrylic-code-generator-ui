import * as cc from "color-convert";


export default class Color {

    public r: number;
    public g: number;
    public b: number;
    
    constructor() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
    }

    public static fromRgb(r: number, g: number, b: number): Color {
        if (r < 0 || r > 255 ||
            g < 0 || g > 255 ||
            b < 0 || b > 255) {
            throw new Error("RGB values must be between 0 and 255");
        }
        const c = new Color();
        c.r = r;
        c.g = g;
        c.b = b;
        return c;
    }

    public static fromHsv(h: number, s: number, v: number): Color {
        const rgb = cc.hsv.rgb([h, s, v]);
        return Color.fromRgb(rgb[0], rgb[1], rgb[2]);
    }

    public static fromString(s: string): Color {
        const rgb = cc.hex.rgb(s);
        return Color.fromRgb(rgb[0], rgb[1], rgb[2]);
    }

    public toHsv(): number[] {
        const hsv = cc.rgb.hsv(this.r, this.g, this.b);
        hsv[0] = Math.floor((hsv[0] / 360) * 255);
        hsv[1] = Math.floor((hsv[1] / 100) * 255);
        hsv[2] = Math.floor((hsv[2] / 100) * 255);
        return hsv;
    }

    public toCrgb(): string {
        return `CRGB(${this.r},${this.g},${this.b})`;
    }
    
    public toNamedCrgb(name: string): string {
        return `CRGB ${name}(${this.r},${this.g},${this.b};)`;
    }

    public toChsv(): string {
        const hsv = this.toHsv();
        return `CHSV(${hsv})`;
    }

    public toNamedChsv(name: string): string {
        const hsv = this.toHsv();
        return `CHSV ${name}(${hsv});`;
    }

    public toString(): string {
        return cc.rgb.hex(this.r, this.g, this.b);
    }

}

export type ColorId = [number, Color];

export class ColorList {

    private nextId = 0;
    public colors: ColorId[];

    constructor() {
        this.colors = [];
    }

    public addColor(color: Color): boolean {
        if (this.hasColor(color) >= 0) {
            return false;
        }
        this.colors.push([this.nextId++, color]);
        return true;
    }

    public removeColor(color: Color): boolean {
        const idx = this.hasColor(color);
        if (idx < 0) {
            return false;
        }
        this.colors.splice(idx, 1);
        return true;
    }

    public hasColor(color: Color): number {
        for (let i = 0; i < this.colors.length; i++) {
            const c = this.colors[i][1];
            if (c.r == color.r && c.g == color.g && c.b == color.b) {
                return i;
            }
        }
        return -1;
    }

    public getIdx(color: Color): number {
        const i = this.hasColor(color);
        if (i < 0) {
            return -1;
        }
        return this.colors[i][0];
    }

}
