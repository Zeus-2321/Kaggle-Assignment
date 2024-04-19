import { chromium } from 'playwright';
import csvParser from 'csv-parser';
import path from 'path';
import fs from 'fs';
import extract from 'extract-zip';
require('dotenv').config();

interface BabyNameData {
    name: string;
    sex: string;
}

async function fetchData(): Promise<BabyNameData[]> {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        console.log('Browser launched successfully.');

        console.log('Creating new page...');
        const page = await browser.newPage();
        console.log('New page created.');

        console.log('Navigating to login page...');
        await page.goto('https://www.kaggle.com/account/login?phase=emailSignIn&returnUrl=%2F');
        console.log('Filling login form...');
        await page.fill('input[name="email"]', 'devpratap2321@gmail.com');
        await page.fill('input[name="password"]', "HeheBoii@2321");
        await page.click('button[type="submit"]');
        console.log('Login form filled and submitted.');

        console.log('Waiting for page to load...');
        await page.waitForURL("https://www.kaggle.com/");

        console.log('Navigating to dataset URL...');
        await page.goto('https://www.kaggle.com/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv');

        console.log('Initiating download...');
        page.click('i:has-text("get_app")');

        console.log('Waiting for download to start...');
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.waitForTimeout(5000),
        ]);
        console.log('Download started.');

        const downloadPath = await download.path();
        console.log('Download path:', downloadPath);
        const renamedFilePath = 'downloaded.zip'; 
        fs.renameSync(downloadPath, renamedFilePath);

        const extractionDir = path.resolve('extracted');
        await extract(renamedFilePath, { dir: extractionDir });

        const babyNames: BabyNameData[] = [];
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(path.join(extractionDir, 'babyNamesUSYOB-full.csv'))
                .pipe(csvParser({
                    skipLines: 1,
                    headers: false,
                }))
                .on('data', (row) => {
                    const Name = row[1];
                    const Sex = row[2];
                    babyNames.push({ name: Name, sex: Sex });
                })
                .on('end', () => {
                    console.log('CSV file successfully processed.');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error parsing CSV:', err);
                    reject(err);
                });
        });

        return babyNames;

    } catch (error) {
        console.error(error);
        return [];
    }
}

export { fetchData };