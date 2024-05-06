import path from "path";
import { sleep } from "../utils/sleep";
import { PERFORMANCE_ARGS } from "../utils/envs";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import 'dotenv/config';


puppeteer.use(StealthPlugin());

const recaptchaPlugin = RecaptchaPlugin({
  provider: {
    id: "2captcha",
    token: process.env.APIKEY_2CAPTCHA,
  },
});
puppeteer.use(recaptchaPlugin);

export class BrowserHandler {
  async openForManualLogin(url: string): Promise<void> {
    let attempt = 0;
    const maxAttempts = 10000;

    while (attempt < maxAttempts) {
      console.log(`Attempt ${attempt + 1} to navigate to URL:`, url);
      let browser;
      try {
        browser = await puppeteer.launch({
          headless: process.env.PUPPETEER_EXECUTABLE_PATH ? true : false,
          defaultViewport: null,
          args: process.env.PUPPETEER_EXECUTABLE_PATH ? PERFORMANCE_ARGS : [],
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
          userDataDir: path.join(__dirname, "..", "utils", "cookies.json"),
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
          request.continue();
        });

        page.on('response', async response => {
          if (response.url().endsWith('.r7.com/vote')) {
            console.log(response.status());
          }
        });

        await page.goto(url, { waitUntil: "networkidle0" });
        await sleep(1000);

        await page.waitForSelector('.voting-button--hidden[data-id="4035"][data-participant-id="463"]', { visible: true });
        await page.click('.voting-button--hidden[data-id="4035"][data-participant-id="463"]');
        const buttonSelector = ".card-selectable-action > button.voting-button";
        await page.waitForSelector(buttonSelector);
        const button = await page.$(buttonSelector);
        await page.solveRecaptchas();
        await button?.click();
        console.log("Voting button clicked.");
        await sleep(500);

      } catch (error) {
        console.error("Error during the voting process:", error);
      } finally {
        if (browser) {
          await browser.close();
          console.log("Browser closed.");
        }
        attempt++;
      }
    }
  }
}
