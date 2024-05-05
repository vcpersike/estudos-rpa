import path from "path";
import { sleep } from "../utils/sleep";
import { PERFORMANCE_ARGS } from "../utils/envs";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export class BrowserHandler {

  async openForManualLogin(url: string): Promise<void> {
    console.log("Attempting to navigate to URL:", url);

    console.log("Browser launched", puppeteer.executablePath());
    const browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_EXECUTABLE_PATH ? true : false,
      defaultViewport: null,
      args: process.env.PUPPETEER_EXECUTABLE_PATH ? PERFORMANCE_ARGS : [],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
      userDataDir: path.join(__dirname, "..", "utils", "cookies.json"),
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246');

    await page.goto(url);
    await sleep(50000);
    await page.screenshot({
      path: "./screenshot/example.png",
    });
    await browser.close();
  }
}
