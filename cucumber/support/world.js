import {
  setWorldConstructor,
  Before,
  After,
  AfterAll,
} from "@cucumber/cucumber";

import { chromium } from "@playwright/test";

let browser;

class PlaywrightWorld {
  constructor({ attach }) {
    this.attach = attach;
    this.page = null;
    this.context = null;
  }
}

setWorldConstructor(PlaywrightWorld);

Before(async function () {
  if (!browser) browser = await chromium.launch({ headless: true });
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === "FAILED") {
    const screenshot = await this.page.screenshot({ fullpage: true });
    await this.attach(screenshot, "image/png");
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
