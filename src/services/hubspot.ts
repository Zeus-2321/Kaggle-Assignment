import axios from 'axios';
import BabyName from '../models/BabyName';
require('dotenv').config();

async function sendDataToHubSpot(): Promise<void> {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.hubspot.com/crm/v3/objects/contact/batch/create`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    try {
        const babyNames = await BabyName.findAll({ offset: 10, limit: 100 });

        const contactData = babyNames.map((entry) => ({
            properties: {
                "firstname": entry.name,
                "gender": entry.sex,
            }
        }));

        const postData = {
            inputs: contactData,
        };

        const response = await axios.post(apiUrl, postData, { headers });

        console.log('Data sent to HubSpot successfully:', response.data);
    } catch (error) {
        console.log(error);
    }
}

export { sendDataToHubSpot };
