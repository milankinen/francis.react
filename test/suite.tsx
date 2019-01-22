import * as F from "francis";
import * as path from "path";
import Bundler from "parcel-bundler";
import puppeteer from "puppeteer";
import expectp from "expect-puppeteer";

const APP_URL = "file://" + path.join(__dirname, "dist/app.html");

describe("francis.react", () => {
  let browser: puppeteer.Browser = void 0 as any;
  let page: puppeteer.Page = void 0 as any;

  beforeAll(done => {
    new Bundler([path.join(__dirname, "app.html")], {
      watch: false,
      minify: true,
      sourceMaps: false,
      publicUrl: "file://" + path.join(__dirname, "dist"),
      outDir: path.join(__dirname, "dist"),
      logLevel: 1
    })
      .bundle()
      .then(() => puppeteer.launch())
      .then(b => (browser = b).newPage())
      .then(p => (page = p))
      .then(() => done())
      .catch(done.fail);
  }, 30000);

  afterAll(done => {
    if (browser) {
      browser
        .close()
        .then(() => done())
        .catch(done.fail);
    } else {
      done();
    }
  });

  it("works with basic synchronous case", async () => {
    await page.goto(APP_URL);
    await expectp(page).toClick("button", { text: "Basic test" });
    await expectp(page).toMatch("Counter is: 0");
    await expectp(page).toClick("button", { text: "++" });
    await expectp(page).toClick("button", { text: "++" });
    await expectp(page).toMatch("Counter is: 2");
    await expectp(page).toClick("button", { text: "--" });
    await expectp(page).toMatch("Counter is: 1");
  });

  it("supports individual observable style props", async () => {
    await page.goto(APP_URL);
    const text = () =>
      F.repeat(() =>
        F.merge(
          F.filter(() => false, F.later(50, "")),
          F.fromPromise<string>(
            page.evaluate(
              () => (document.getElementById("styled") as any).innerText
            )
          )
        )
      );
    await expectp(page).toClick("button", { text: "Style props test" });
    expect(await F.firstToPromise(text())).toEqual("This text is visible!");
    expect(
      await F.pipe(
        text(),
        F.filter(t => t !== "This text is visible!"),
        F.firstToPromise
      )
    ).toEqual("This text visible!");
  });

  it("supports local state atoms", async () => {
    await page.goto(APP_URL);
    await expectp(page).toClick("button", { text: "Local state test" });
    await expectp(page).toMatch("> Hello!");
    await expectp(page).toClick("button", { text: "!" });
    await expectp(page).toClick("button", { text: "!" });
    await expectp(page).toClick("button", { text: ">" });
    await expectp(page).toClick("button", { text: "!" });
    await expectp(page).toMatch(">> Hello!!!!");
  });

  it("works with React.Suspense", async () => {
    await page.goto(APP_URL);
    await expectp(page).toClick("button", { text: "Suspense test" });
    await expectp(page).toMatch("Loading...");
    await expectp(page).toMatch("Tsers", { timeout: 2000 });
  });

  it("disposes resources after aborted suspense", async () => {
    await page.goto(APP_URL);
    await expectp(page).toClick("button", { text: "Aborted suspense test" });
    await expectp(page).toMatch("Loading...");
    await expectp(page).toMatch("Aborted/Disposed", { timeout: 2000 });
  });
});
