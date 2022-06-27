const puppeteer = require("puppeteer");
const critical = require("critical");
 
const launchOptions = {
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    "--disable-gpu",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--ignore-certificate-errors",
  ],
};
 
async function run() {
  const browser = await puppeteer.launch(launchOptions);
 
 // sample request to render the inline css
  critical.generate({
    inline: false,
    src: "https://www.dell.com/community/%E6%88%B4%E5%B0%94%E7%A4%BE%E5%8C%BA/ct-p/Chinese",
    width: 4000,
    height: 4000,
    // minify: true,
    rebase: false,
    assetPaths: ["https://www.dell.com"],
    penthouse: {
      timeout: 300000,
      forceInclude: [
        /(.*)\.lia-user-avatar-message/,
        /\.lia-community-hero-icons(.*)/,
        /\.lia-header-actions(.*)/,
        ".user-navigation-settings-drop-down",
      ],
      puppeteer: { getBrowser: browser },
    },
  });
}
 
run();
