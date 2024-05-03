
import puppeteer from "puppeteer";
import path from "path";
import { Arguments } from "../../utils/constructor";

export class BrowserHandler extends Arguments {
    constructor() {
        super();
    }

    async openForManualLogin(url: string): Promise<void> {
        console.log("Attempting to navigate to URL:", url);

        const browser = await puppeteer.launch({
            headless: process.env.BROWSER_HEADLESS === 'false' ? false : true,
            args: this.puppeteerArgs,
            userDataDir: path.join(__dirname, '..', '..', 'utils', 'cookies.json'),
        });
        const page = await browser.newPage();
        await page.goto(url);
        await browser.close();
    }
}
