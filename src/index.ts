import {fetchData } from './services/kaggle'
import { saveDataToDatabase } from './services/mysql';
import { sendDataToHubSpot } from './services/hubspot';

async function main() {
  try {
    const kaggleData = await fetchData();

    await saveDataToDatabase(kaggleData);

    await sendDataToHubSpot();

    console.log('Process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
