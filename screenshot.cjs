const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport for a good desktop screenshot
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Taking screenshot of Promptu...");
  try {
    await page.goto('https://chromewebstore.google.com/detail/promptu/gaafidhicjnpkdpcacfgehiafmliajah', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000)); // wait for images to load
    await page.screenshot({ path: './public/promptu.png' });
    console.log("Promptu screenshot saved.");
  } catch(e) {
    console.error("Error Promptu:", e);
  }

  console.log("Taking screenshot of Tour With Yash...");
  try {
    await page.goto('https://tourwithyash.onrender.com/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000)); // wait for load
    await page.screenshot({ path: './public/tourwithyash.png' });
    console.log("Tour With Yash screenshot saved.");
  } catch(e) {
    console.error("Error Tour:", e);
  }

  await browser.close();
})();
