import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({
    path: 'C:/Users/HP/.gemini/antigravity-ide/brain/016ad5b0-5cb1-4793-8b8a-c5a557c500a8/render_1920x1080.png'
  });
  await browser.close();
  console.log('Screenshot captured successfully');
})();
