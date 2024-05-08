import path from "path";
import { sleep } from "../utils/sleep";
import { PERFORMANCE_ARGS } from "../utils/envs";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { RedisHandler } from './redis-handler';
import 'dotenv/config';

puppeteer.use(StealthPlugin());

const recaptchaPlugin = RecaptchaPlugin({
  provider: {
    id: "2captcha",
    token: process.env.APIKEY_2CAPTCHA
  },
});
puppeteer.use(recaptchaPlugin);

export class BrowserHandler {
  private redisHandler = new RedisHandler();
  async openForManualLogin(url: string): Promise<void> {
    console.log("Attempting to navigate to URL:", url);
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
    await page.setRequestInterception(true);
    page.on('request', request => {
      request.continue();
    });

    page.on('response', async response => {
      if (response.url().endsWith('.r7.com/vote')) {
        if (response.status() === 200) {
          const key = process.env.REDIS_KEY_PREFIX_200 || '';
          await this.redisHandler.incr(key);
        } else if (response.status() === 401) {
          const key = process.env.REDIS_KEY_PREFIX_401 || '';
          await this.redisHandler.incr(key);
        }
      }
    });

    await page.goto(url, { waitUntil: "networkidle0" });
    await sleep(1000);

    try {
      const numberOfVotes = 100000;

      for (let i = 0; i < numberOfVotes; i++) {
        console.log(`Iniciando tentativa de voto número ${i + 1}`);

        await page.waitForSelector(
          '.voting-button--hidden[data-id="4112"][data-participant-id="463"]',
          { visible: true }
        );
        await page.click(
          '.voting-button--hidden[data-id="4112"][data-participant-id="463"]'
        );
        const buttonSelector = ".card-selectable-action > button.voting-button";
        await page.waitForSelector(buttonSelector);
        const button = await page.$(buttonSelector);
        await page.solveRecaptchas();
        await button?.click();
        await sleep(1000);
        console.log("Botão de votação clicado.");

        await page.waitForSelector("button.vote-confirmation__button", {
          visible: true,
        });
        await page.click("button.vote-confirmation__button");
        await sleep(1000);
        const selector = "#selectable-4112";
        await page.waitForSelector(selector, { visible: true });
        await page.click(selector);
        await sleep(1000);
      }
    } catch (error) {
      console.error("Erro ao tentar clicar no botão:", error);
    } finally {
      await browser.close();
      await this.redisHandler.quit();
      console.log("Navegador fechado.");
    }
  }
}
