import path from "path";
import fs from 'fs';

export class Arguments {
    public puppeteerArgs: string[];
    constructor() {
        const configPath = path.join(__dirname, '../utils', 'args.json');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configFile);
        this.puppeteerArgs = config.puppeteerArgs;
        console.log("Puppeteer args loaded:", this.puppeteerArgs);  // Adicionar log para verificar argumentos
    }
}