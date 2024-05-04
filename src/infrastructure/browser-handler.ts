import puppeteer from "puppeteer";
import path from "path";
import { sleep } from "../utils/sleep";
import { PERFORMANCE_ARGS } from "../utils/envs";

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
    await page.goto(url);
    await sleep(5000);
    await page.screenshot({
      path: "./screenshot/example.png",
    });
    await browser.close();
  }
}
