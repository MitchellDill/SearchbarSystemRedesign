const puppeteer = require("puppeteer");

describe("Puppeteer", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto("http://localhost:3002");
  });

  it("should log 'bobby k' when entering 'bobby' into search bar", async () => {
    // await page.waitForNavigation({ waitUntil: "load" });
    try {
      await page.click("#search");
      await page.keyboard.type("bobby");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      const log = await page.on("console", () => {
        console.log("bobby k");
      });
      await expect(log).toMatch("bobby k");
    } finally {
      browser.close();
    }
  });
});
