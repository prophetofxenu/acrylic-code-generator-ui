import Color from "./color";


function randomId(): string {
    const arr = new Uint8Array(2);
    window.crypto.getRandomValues(arr);
    let hex = "";
    for (const x of arr) {
        hex += ('0' + (x & 0xFF).toString(16)).slice(-2);
    }
    return hex;
}

export type ModeParamType = "num" | "color" | "colorlist";
export type ValueType = string | number | Color | Color[];

export interface ValidatorFunction {
    (value: any): boolean;
}

const colorValidator = function(c: Color) {
    return true;
};

const colorlistValidator = function(cl: Color[]) {
    return true;
};

const numberValidator = function(min: number, max: number) {
    return (n: number) => {
        return n <= max && n >= min;
    }
}


export class ModeParam {

    constructor(
        public Name: string,
        public Type: ModeParamType,
        public Default: string | number | Color | Color[],
        public Validator: ValidatorFunction
    ) {}

}

export class Mode {

    public Id: string;
    public DefaultName: string;

    constructor(
        public Name: string,
        public Type: string,
        public Description: string,
        public Params: Map<string, ModeParam>,
        public Values: Map<string, ValueType>
    ) {
        this.Id = `${Type}${randomId()}`;
        this.DefaultName = Name;
    }

    public setParam(key: string, value: ValueType): void {
        if (!this.Params.has(key)) {
            throw new Error("Invalid param key");
        }
        const validator = this.Params.get(key)?.Validator;
        if (validator === undefined || !validator(value)) {
            throw new Error("Invalid param value");
        }
        this.Values.set(key, value);
    }

    public resetParam(key: string): void {
        if (!this.Params.has(key)) {
            throw new Error("Invalid param key");
        }
        const def = this.Params.get(key)?.Default;
        if (def === undefined) {
            throw Error("Default not defined");
        }
        this.Values.set(key, def);
    }

}


export class BreathingMode extends Mode {

    constructor() {
        super(
            "Breathing",
            "breathing",
            "Breathing between a list of colors.",
            new Map([
                ["colors", new ModeParam(
                    "Colors",
                    "colorlist",
                    [
                        Color.fromRgb(255, 0, 0),
                        Color.fromRgb(0, 255, 0),
                        Color.fromRgb(0, 0, 255)
                    ],
                    colorlistValidator
                )]
            ]),
            new Map([
                ["colors", [
                    Color.fromRgb(255, 0, 0),
                    Color.fromRgb(0, 255, 0),
                    Color.fromRgb(0, 0, 255)
                ]]
            ])
        )
    }

}


export class CandleMode extends Mode {

    constructor() {
        super(
            "Candle",
            "candle",
            "Random flickering of a color, like a candle.",
            new Map([
                ["color", new ModeParam(
                    "Color",
                    "color",
                    Color.fromRgb(255, 0, 0),
                    colorValidator
                )]
            ]),
            new Map([
                ["color", Color.fromRgb(255, 0, 0)]
            ])
        );
    }

}


export class MarqueeMode extends Mode {

    constructor() {
        super(
            "Marquee",
            "marquee",
            "Chasing lights of a color.",
            new Map([
                ["color", new ModeParam(
                    "Color",
                    "color",
                    Color.fromRgb(255, 0, 0),
                    colorValidator
                )],
                ["delay", new ModeParam(
                    "Delay",
                    "num",
                    100,
                    numberValidator(5, 200)
                )]
            ]),
            new Map<string, ValueType>([
                ["color", Color.fromRgb(255, 0, 0)],
                ["delay", 100]
            ])
        );
    }

}


export class RainbowMode extends Mode {

    constructor() {
        super(
            "Rainbow",
            "rainbow",
            "Slow movement through color spectrum, with lights slightly out of sync to create a gradient.",
            new Map(),
            new Map()
        )
    }

}


export class SolidMode extends Mode {

    constructor() {
        super(
            "Solid",
            "solid",
            "Just a single, unchanging color.",
            new Map([
                ["color", new ModeParam(
                    "Color",
                    "color",
                    Color.fromRgb(255, 0, 0),
                    colorValidator
                )]
            ]),
            new Map([
                ["color", Color.fromRgb(255, 0, 0)]
            ])
        );
    }

}


export class SpectrumCycleMode extends Mode {

    constructor() {
        super(
            "Spectrum Cycle",
            "spectrumcycle",
            "Moves all lights through the color spectrum in unison.",
            new Map(),
            new Map()
        );
    }

}

