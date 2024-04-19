import BabyName from '../models/BabyName';

interface BabyNameData {
    name: string;
    sex: string;
}

async function saveDataToDatabase(data: BabyNameData[]): Promise<void> {
    try {
        const batchSize = 100000;
        const totalRecords = data.length;
        let startIndex = 1;

        while (startIndex < totalRecords) {
            const endIndex = Math.min(startIndex + batchSize, totalRecords);
            const batchData = data.slice(startIndex, endIndex);

            const formattedData = batchData.map(({ name, sex }) => ({ name, sex }));

            await BabyName.bulkCreate(formattedData);

            console.log(`Batch inserted: ${batchData.length} records`);

            startIndex += batchSize;
        }

        console.log('Data saved to MySQL database successfully.');
    } catch (error) {
        throw new Error(`Error saving data to MySQL database: ${error}`);
    }
}

export { saveDataToDatabase };
