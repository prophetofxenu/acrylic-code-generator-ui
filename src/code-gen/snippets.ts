import { Mode, BreathingMode, CandleMode, MarqueeMode, RainbowMode, SolidMode,
    SpectrumCycleMode } from "./modes";

export interface ModeSnippet {
    Mode: Mode;
    ObjectConstructor: (name: string, params: string) => string;
};

export class BreathingSnippet implements ModeSnippet {

    public Mode: BreathingMode;

    constructor(mode: BreathingMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        let s = `CHSV ${name}Colors[] = { ${params} };\n`;
        s += `Breathing ${name}(${name}Colors,`;
        s += `sizeof(${name}Colors) / sizeof(CHSV),`;
        s += "leds,NUM_LEDS);";
        return s;
    }

};

export class CandleSnippet implements ModeSnippet {

    public Mode: CandleMode;

    constructor(mode: CandleMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        return `CandleM ${name}(${params},leds,NUM_LEDS);`;
    }

};

export class MarqueeSnippet implements ModeSnippet {

    public Mode: MarqueeMode;

    constructor(mode: MarqueeMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        return `Marquee ${name}(${params},leds,NUM_LEDS);`;
    }

};

export class RainbowSnippet implements ModeSnippet {

    public Mode: RainbowMode;

    constructor(mode: RainbowMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        if (params !== "") {
            throw Error("Rainbow mode does not take any parameters");
        }
        return `Rainbow ${name}(leds,NUM_LEDS);`;
    }

};

export class SolidSnippet implements ModeSnippet {

    public Mode: SolidMode;

    constructor(mode: SolidMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        return `Solid ${name}(${params},leds,NUM_LEDS);`;
    }

};

export class SpectrumCycleSnippet implements ModeSnippet {

    public Mode: SpectrumCycleMode;

    constructor(mode: SpectrumCycleMode) {
        this.Mode = mode;
    }

    public ObjectConstructor(name: string, params: string): string {
        if (params !== "") {
            throw Error("Spectrum Cycle does not take any parameters");
        }
        return `SpectrumCycle ${name}(leds,NUM_LEDS);`;
    }

};

export function snippetFromMode(mode: Mode): ModeSnippet {
    let type = mode.Type;
    switch (type) {
        case "breathing":
            return new BreathingSnippet(mode);
        case "candle":
            return new CandleSnippet(mode);
        case "marquee":
            return new MarqueeSnippet(mode);
        case "rainbow":
            return new RainbowSnippet(mode);
        case "solid":
            return new SolidSnippet(mode);
        case "spectrumcycle":
            return new SpectrumCycleSnippet(mode);
        default:
            throw Error(`Snippet for mode "${type}" not implemented`);
    }
}


