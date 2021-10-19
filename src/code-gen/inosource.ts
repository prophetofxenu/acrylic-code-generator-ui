import Color, { ColorList } from "./color";
import { Mode } from "./modes";
import { snippetFromMode } from "./snippets";

import JSZip from "jszip";
import * as fs from "fs";


export const modeSources = [
    "solid"
];

export class ModeSource {

    public ModeKey: string;
    public HeaderFilename: string;
    public SourceFilename: string;
    public HContents: string;
    public CppContents: string;

    constructor(modeKey: string) {
        this.ModeKey = modeKey;
        this.HeaderFilename = `${modeKey}.h`;
        this.SourceFilename = `${modeKey}.cpp`;
        this.HContents = "";
        this.CppContents = "";

        fs.readFile(`ino_code/${this.HeaderFilename}`, (err, data) => {
            if (err) {
                throw err;
            }
            this.HContents = String(data);
        });
        fs.readFile(`ino_code/${this.SourceFilename}`, (err, data) => {
            if (err) {
                throw err;
            }
            this.CppContents = String(data);
        });
    }

}

export type SourceMap = Map<string, ModeSource>;

export const loadSources = function(): ModeSource[] {
    const sources = [];
    for (const m of modeSources) {
        sources.push(new ModeSource(m)); 
    } return sources;
};


export class SourceManager {

    private static readonly ModeSources = [
        "breathing",
        "candle",
        "marquee",
        "rainbow",
        "solid",
        "spectrumcycle"
    ];

    private modeIdx = 0;
    private mainTop = "";
    private mainBottom = "";
    private modeh = "";
    private sources: Map<string, ModeSource>;
    private modes: Mode[];

    constructor() {
        this.sources = new Map<string, ModeSource>();
        this.modes = [];
        this.loadSources();
    }

    private async loadSources(): Promise<void> {
        for (const m of SourceManager.ModeSources) {
            this.sources.set(m, new ModeSource(m));
        }

        this.mainTop = String(await fs.promises.readFile("ino_code/main_top.ino"));
        this.mainBottom = String(await fs.promises.readFile("ino_code/main_bottom.ino"));
        this.modeh = String(await fs.promises.readFile("ino_code/mode.h"));
    }

    public addMode(mode: Mode): void {
        mode.Name += `${this.modeIdx++}`;
        this.modes.push(mode);
    }

    public removeMode(mode: Mode): void {
        for (let i = 0; i < this.modes.length; i++) {
            if (this.modes[i] === mode) {
                this.modes.splice(i, 1);
            }
        }
    }

    private getColors(): ColorList {
        const colors = new ColorList();
        for (const m of this.modes) {
            for (const [key, param] of m.Params) {
                if (param.Type === "color") {
                    const color = m.Values.get(key) as Color;
                    colors.addColor(color);
                } else if (param.Type === "colorlist") {
                    const colorlist = m.Values.get(key) as Color[];
                    for (const c of colorlist) {
                        colors.addColor(c);
                    }
                }
            }
        }
        return colors;
    }

    private generateMain(): string {

        // includes
        const includes = new Set<string>();
        for (const m of this.modes) {
            includes.add(m.Type);
        }
        let includesStr = "";
        for (const i of includes) {
            includesStr += `#include "${i}.h"\n`;
        }

        // colors
        const colors = this.getColors();
        let colorsStr = "";
        for (const c of colors.colors) {
            const str = c[1].toNamedChsv(`color${c[0]}`);
            colorsStr += str + "\n";
        }

        // modes
        let modesStr = "";
        let modesListStr = "Mode *modes[] = {\n";
        let modeIdx = 0;
        for (let i = 0; i < this.modes.length; i++) {
            const m = this.modes[i];
            const params = m.Params;
            const values = [];
            for (const [k, v] of params) {
                const val = m.Values.get(k);
                if (v.Type === "color") {
                    values.push(`color${colors.getIdx(val as Color)}`)
                } else if (v.Type === "colorlist") {
                    const colorIdxs = [];
                    for (const c of val as Color[]) {
                        colorIdxs.push(`color${colors.getIdx(c)}`);
                    }
                    values.push(colorIdxs.join(","));
                }
            }
            const snippet = snippetFromMode(m);
            const name = `${m.Type}${modeIdx++}`;
            const constructor = snippet.ObjectConstructor(name, values.join(","));
            modesStr += constructor + "\n";

            modesListStr += `  &${name}`;
            if (i < this.modes.length - 1) {
                modesListStr += ",";
            }
            modesListStr += "\n";
        }
        modesListStr += "};";

        const main = includesStr + this.mainTop + colorsStr + modesStr + modesListStr +
            this.mainBottom;
        return main;
        
    }

    private async writeZip(zip: typeof JSZip, destPath: string): Promise<void> {
        await zip.generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(fs.createWriteStream(destPath));
    }

    public async generateZip(destPath: string): Promise<void> {
        const zip = new JSZip();
        const mainDir = zip.folder("main");
        if (mainDir === null) {
            throw Error("Error during Zip creation");
        }
        const main = this.generateMain();
        mainDir.file("main.ino", main);
        mainDir.file("mode.h", this.modeh);

        const includes = new Set<string>();
        for (const m of this.modes) {
            includes.add(m.Type);
        }
        for (const i of includes) {
            const source = this.sources.get(i);
            if (source === undefined) {
                throw Error("Unable to retrieve sources");
            }
            mainDir.file(source.HeaderFilename, source.HContents);
            mainDir.file(source.SourceFilename, source.CppContents);
        }
        await this.writeZip(zip, destPath);
    }

}
